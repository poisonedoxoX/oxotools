import React, { useState, useRef, useCallback, lazy, Suspense } from "react";
import { MessageCircle } from "lucide-react";

const ChatPanel = lazy(() => import("./ChatPanel"));

const ChatBubble: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:brightness-110 active:scale-95 transition-all"
        aria-label="Chat"
      >
        <MessageCircle size={22} />
      </button>

      {/* Lazy-loaded panel */}
      {open && (
        <Suspense fallback={null}>
          <ChatPanel onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

export default ChatBubble;
