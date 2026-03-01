import { useState, useRef, useEffect } from "react";
import type { Source } from "@/hooks/useChat";

interface CitationChipProps {
  index: number;
  source: Source;
}

export function CitationChip({ index, source }: CitationChipProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        chipRef.current &&
        !chipRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reposition popover to stay in viewport
  useEffect(() => {
    if (!open || !popoverRef.current) return;
    const el = popoverRef.current;
    const rect = el.getBoundingClientRect();
    // If overflowing right
    if (rect.right > window.innerWidth - 16) {
      el.style.left = "auto";
      el.style.right = "0";
    }
    // If overflowing left
    if (rect.left < 16) {
      el.style.left = "0";
      el.style.right = "auto";
    }
  }, [open]);

  return (
    <span className="relative inline-block">
      <button
        ref={chipRef}
        className="citation-chip"
        onClick={() => setOpen(!open)}
        aria-label={`View source ${index + 1}`}
      >
        [{index + 1}]
      </button>
      {open && (
        <div
          ref={popoverRef}
          className="absolute left-0 z-50 w-[340px] max-w-[85vw] animate-fade-in"
          style={{ bottom: "calc(100% + 8px)" }}
        >
          <div className="rounded-lg border border-border bg-popover p-4 shadow-xl glow-primary">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-primary uppercase tracking-wider font-semibold">
                Source [{index + 1}]
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm leading-none px-1"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground mb-3 font-mono">
              {source.metadata?.page && (
                <span className="px-1.5 py-0.5 rounded bg-secondary">
                  Page {source.metadata.page}
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded bg-secondary">
                Sim: {source.similarity?.toFixed(3) ?? "—"}
              </span>
            </div>
            <div className="text-sm text-foreground leading-relaxed max-h-48 overflow-y-auto pr-1 border-t border-border pt-3">
              <p className="whitespace-pre-wrap break-words">{source.content}</p>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
