import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/hooks/use-lang";

type Msg = { role: "user" | "assistant"; content: string };

const ChatPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: updated },
      });

      if (error || data?.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: data?.error || t("unexpectedError") }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t("unexpectedError") }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, t]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-20 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-surface/95 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-stack flex flex-col overflow-hidden"
      style={{ maxHeight: "min(480px, 60vh)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/5">
        <span className="text-sm font-medium text-foreground">{t("chatAssistant")}</span>
        <button onClick={onClose} className="p-1 hover:bg-foreground/5 rounded-lg transition-colors">
          <X size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[120px]">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground/60 text-center pt-8">{t("chatPlaceholder")}</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/5 text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-foreground/5 px-3 py-2 rounded-xl">
              <Loader2 size={14} className="text-muted-foreground animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-2 border-t border-foreground/5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chatInputPlaceholder")}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
