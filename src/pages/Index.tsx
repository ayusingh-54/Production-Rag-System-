import { useState, useRef, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { playTypingSound, playResponseSound } from "@/lib/sounds";

const SUGGESTIONS = [
  "How often should infants be breastfed?",
  "What are symptoms of pellagra?",
  "What are micronutrients?",
  "What is the RDI for protein per day?",
];

const Index = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLoadingRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Play sounds on loading state changes
  useEffect(() => {
    if (isLoading && !prevLoadingRef.current) {
      playTypingSound();
    }
    if (!isLoading && prevLoadingRef.current && messages.length > 0) {
      playResponseSound();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading, messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleSuggestion = (s: string) => {
    sendMessage(s);
  };

  return (
    <div className="flex flex-col h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-wide">
              RAG Nutritional Chatbot
              <span className="text-primary">:</span>{" "}
              <span className="text-muted-foreground text-sm normal-case font-display tracking-normal">
                Built from Scratch
              </span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Presented by <span className="text-accent">Ayush Singh</span>
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    RAG Pipeline Active
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Ask anything about nutrition
                </h2>
                <p className="text-muted-foreground text-sm max-w-md">
                  Powered by vector search over a nutrition textbook. Responses include page citations.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-left px-4 py-3 rounded-lg border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all text-sm text-foreground font-display"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-card border border-border rounded-lg">
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-4 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask about nutrition..."
            disabled={isLoading}
            className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors font-display disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
