import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import UploadZone from "@/components/UploadZone";
import ImageCanvas from "@/components/ImageCanvas";
import ComparisonSlider from "@/components/ComparisonSlider";
import ActionBar from "@/components/ActionBar";

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);
  const [watermarkRemoved, setWatermarkRemoved] = useState(false);

  const handleImageUpload = useCallback((file: File, dataUrl: string) => {
    setOriginalImage(dataUrl);
    setEditedImage(null);
    setIsBackgroundRemoved(false);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");

    const img = new Image();
    img.onload = () => setDimensions(`${img.width} × ${img.height}`);
    img.src = dataUrl;
  }, []);

  const processImage = useCallback(async (action: "remove-bg" | "edit", editPrompt?: string) => {
    if (!originalImage) return;
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("image-process", {
        body: {
          imageBase64: originalImage,
          action,
          prompt: editPrompt,
        },
      });

      if (error) {
        toast.error("Processing failed. Please try again.");
        console.error(error);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.image) {
        setEditedImage(data.image);
        if (action === "remove-bg") setIsBackgroundRemoved(true);
        toast.success(action === "remove-bg" ? "Subject isolated." : "Edit applied.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage]);

  const handleRemoveBg = useCallback(() => processImage("remove-bg"), [processImage]);

  const handleGenerate = useCallback(() => {
    if (prompt.trim()) processImage("edit", prompt.trim());
  }, [processImage, prompt]);

  const handleDownload = useCallback(() => {
    if (!editedImage) return;
    const link = document.createElement("a");
    link.href = editedImage;
    link.download = `edited-${fileName || "image"}.png`;
    link.click();
  }, [editedImage, fileName]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-3 md:px-6 md:py-4">
        <h1 className="text-xs md:text-sm font-medium tracking-wider uppercase text-muted-foreground">
          Image Workbench
        </h1>
        {originalImage && (
          <div className="hidden md:flex items-center gap-4 text-[11px] text-muted-foreground/60 tabular-nums tracking-wide">
            <span>{fileName}</span>
            <span>{dimensions}</span>
            <span>{fileSize}</span>
          </div>
        )}
      </header>

      {/* Main canvas area */}
      <main className="flex-1 flex items-center justify-center px-2 pb-20 md:px-6 md:pb-24">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {!originalImage ? (
              <motion.div
                key="upload"
                className="flex items-center justify-center"
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <UploadZone onImageUpload={handleImageUpload} />
              </motion.div>
            ) : editedImage ? (
              <motion.div
                key="comparison"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ComparisonSlider
                  originalSrc={originalImage}
                  editedSrc={editedImage}
                  hasTransparency={isBackgroundRemoved}
                />
              </motion.div>
            ) : (
              <motion.div
                key="original"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ImageCanvas src={originalImage} alt={fileName} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Action Bar */}
      {originalImage && (
        <ActionBar
          prompt={prompt}
          onPromptChange={setPrompt}
          onRemoveBg={handleRemoveBg}
          onGenerate={handleGenerate}
          onDownload={handleDownload}
          isProcessing={isProcessing}
          hasImage={!!originalImage}
          hasResult={!!editedImage}
        />
      )}
    </div>
  );
};

export default Index;
