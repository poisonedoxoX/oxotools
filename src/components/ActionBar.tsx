import React from "react";
import { motion } from "framer-motion";
import { Eraser, Download, Loader2 } from "lucide-react";

interface ActionBarProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onRemoveBg: () => void;
  onGenerate: () => void;
  onDownload: () => void;
  isProcessing: boolean;
  hasImage: boolean;
  hasResult: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  prompt,
  onPromptChange,
  onRemoveBg,
  onGenerate,
  onDownload,
  isProcessing,
  hasImage,
  hasResult,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-surface/80 backdrop-blur-xl rounded-2xl border border-foreground/5 shadow-stack"
    >
      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-primary animate-progress-crawl" />
        </div>
      )}

      <input
        type="text"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe changes..."
        disabled={!hasImage || isProcessing}
        className="bg-transparent px-4 py-2 w-64 focus:outline-none text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-40"
      />

      <button
        onClick={onRemoveBg}
        disabled={!hasImage || isProcessing}
        title="Remove background"
        className="p-2 hover:bg-foreground/5 rounded-lg transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] disabled:opacity-30 disabled:pointer-events-none active:scale-95"
      >
        {isProcessing ? (
          <Loader2 size={18} className="text-muted-foreground animate-spin" />
        ) : (
          <Eraser size={18} className="text-muted-foreground" />
        )}
      </button>

      <button
        onClick={onGenerate}
        disabled={!hasImage || isProcessing || !prompt.trim()}
        className="bg-primary px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground hover:brightness-110 active:scale-95 transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] disabled:opacity-30 disabled:pointer-events-none"
      >
        Generate
      </button>

      {hasResult && (
        <button
          onClick={onDownload}
          title="Download result"
          className="p-2 hover:bg-foreground/5 rounded-lg transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:scale-95"
        >
          <Download size={18} className="text-muted-foreground" />
        </button>
      )}
    </motion.div>
  );
};

export default ActionBar;
