import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import OpenAI from "npm:openai@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: "No message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars", { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey });
      return new Response(JSON.stringify({ error: "Server config error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const sb = createClient(supabaseUrl, supabaseKey);
    const openai = new OpenAI({ apiKey: openaiKey });

    // 1. Embed the user query
    const embRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const queryEmbedding = embRes.data[0].embedding;

    // 2. Retrieve relevant chunks via match_documents RPC
    // Format embedding as a Postgres vector literal: [0.1,0.2,...]
    const embeddingStr = `[${queryEmbedding.join(",")}]`;
    const { data: chunks, error: rpcError } = await sb.rpc("match_documents", {
      query_embedding: embeddingStr,
      match_count: 5,
    });

    if (rpcError) {
      console.error("RPC error:", rpcError);
      return new Response(JSON.stringify({ error: "Search failed", details: rpcError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Build context from retrieved chunks
    const context = (chunks || [])
      .map(
        (c: any, i: number) =>
          `[Source ${i + 1}, Page ${c.metadata?.page ?? "?"}]: ${c.content}`
      )
      .join("\n\n");

    // 4. Build messages for ChatGPT
    const systemPrompt = `You are a helpful nutrition expert assistant. Answer questions based ONLY on the provided context from a nutrition textbook. If the context doesn't contain enough information, say so honestly.

When citing information, reference the source numbers like [1], [2], etc. Be concise but thorough.

Context from the nutrition textbook:
${context}`;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        chatMessages.push({ role: h.role, content: h.content });
      }
    }
    chatMessages.push({ role: "user", content: message });

    // 5. Generate answer
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      temperature: 0.3,
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content || "No response generated.";

    // 6. Return answer + sources
    const sources = (chunks || []).map((c: any) => ({
      id: c.id,
      doc_id: c.doc_id,
      chunk_index: c.chunk_index,
      content: c.content,
      metadata: c.metadata,
      similarity: c.similarity,
    }));

    return new Response(JSON.stringify({ answer, sources }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
