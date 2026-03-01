import ReactMarkdown from "react-markdown";
import type { ChatMessage as ChatMsg } from "@/hooks/useChat";
import { CitationChip } from "./CitationChip";

interface ChatMessageProps {
  message: ChatMsg;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border"
        }`}
      >
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="chat-prose">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-border flex flex-wrap gap-1.5">
                {message.sources.map((src, i) => (
                  <CitationChip key={src.id} index={i} source={src} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
