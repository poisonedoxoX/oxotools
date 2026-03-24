import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eraser, Download, Loader2, Lock, Unlock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/hooks/use-lang";

interface ActionBarProps {
  onRemoveBg: () => void;
  onDownload: () => void;
  isProcessing: boolean;
  hasImage: boolean;
  hasResult: boolean;
  onWatermarkRemoved: (removed: boolean) => void;
  watermarkRemoved: boolean;
  onToggleChat: () => void;
  chatOpen: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onRemoveBg,
  onDownload,
  isProcessing,
  hasImage,
  hasResult,
  onWatermarkRemoved,
  watermarkRemoved,
  onToggleChat,
  chatOpen,
}) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const t = useT();

  const handlePasswordSubmit = () => {
    if (password === "AyllonAIfamilia") {
      onWatermarkRemoved(true);
      setShowPasswordInput(false);
      toast.success(t("watermarkRemoved"));
    } else {
      toast.error(t("incorrectPassword"));
    }
    setPassword("");
  };

  const handlePasswordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePasswordSubmit();
    }
    if (e.key === "Escape") {
      setShowPasswordInput(false);
      setPassword("");
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
      className="fixed bottom-0 left-0 right-0 md:bottom-8 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 flex flex-col items-stretch gap-0 bg-surface/80 backdrop-blur-xl md:rounded-2xl border-t md:border border-foreground/5 shadow-stack"
    >
      {/* Password input row */}
      <AnimatePresence>
        {showPasswordInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-2 pt-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyDown}
                placeholder={t("enterPassword")}
                autoFocus
                className="bg-foreground/5 px-3 py-1.5 flex-1 min-w-0 rounded-lg focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handlePasswordSubmit}
                className="bg-primary px-3 py-1.5 rounded-lg text-xs font-medium text-primary-foreground hover:brightness-110 active:scale-95 transition-all"
              >
                {t("submit")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main action row */}
      <div className="relative flex items-center gap-2 p-2">
        {isProcessing && (
          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-primary animate-progress-crawl" />
          </div>
        )}

        <button
          onClick={onToggleChat}
          title={t("chatAssistant")}
          className={`p-2 rounded-lg transition-all active:scale-95 ${chatOpen ? "bg-primary text-primary-foreground" : "hover:bg-foreground/5 text-muted-foreground"}`}
        >
          <MessageCircle size={18} />
        </button>

        <button
          onClick={onRemoveBg}
          disabled={!hasImage || isProcessing}
          title={t("removeBackground")}
          className="p-2 hover:bg-foreground/5 rounded-lg transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none active:scale-95"
        >
          {isProcessing ? (
            <Loader2 size={18} className="text-muted-foreground animate-spin" />
          ) : (
            <Eraser size={18} className="text-muted-foreground" />
          )}
        </button>

        {hasResult && (
          <>
            <button
              onClick={() => {
                if (watermarkRemoved) {
                  onWatermarkRemoved(false);
                  toast(t("watermarkRestored"));
                } else {
                  setShowPasswordInput((v) => !v);
                }
              }}
              title={watermarkRemoved ? t("restoreWatermark") : t("removeWatermark")}
              className="p-2 hover:bg-foreground/5 rounded-lg transition-all active:scale-95"
            >
              {watermarkRemoved ? (
                <Unlock size={18} className="text-muted-foreground" />
              ) : (
                <Lock size={18} className="text-muted-foreground" />
              )}
            </button>

            <button
              onClick={onDownload}
              title={t("downloadResult")}
              className="p-2 hover:bg-foreground/5 rounded-lg transition-all active:scale-95"
            >
              <Download size={18} className="text-muted-foreground" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ActionBar;
