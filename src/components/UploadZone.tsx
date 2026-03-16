import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onImageUpload: (file: File, dataUrl: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageUpload(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center w-full max-w-2xl aspect-[4/3]
        rounded-[20px] cursor-pointer transition-colors duration-200
        border border-dashed
        ${isDragOver
          ? "bg-surface border-primary"
          : "bg-background border-border hover:border-muted-foreground/30"
        }
      `}
    >
      <Upload className="w-8 h-8 text-muted-foreground mb-4" strokeWidth={1.5} />
      <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
        Drop image to begin
      </p>
      <p className="text-xs text-muted-foreground/50 mt-2">
        or click to browse
      </p>
    </motion.div>
  );
};

export default UploadZone;
