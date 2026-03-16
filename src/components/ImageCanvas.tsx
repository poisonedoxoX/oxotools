import React from "react";
import { motion } from "framer-motion";

interface ImageCanvasProps {
  src: string;
  alt?: string;
  hasTransparency?: boolean;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ src, alt = "Image", hasTransparency }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-4 bg-surface rounded-[20px] shadow-stack"
    >
      <div className={`rounded-[12px] overflow-hidden outline outline-1 outline-foreground/10 -outline-offset-1 ${hasTransparency ? 'checkerboard' : ''}`}>
        <img src={src} alt={alt} className="block w-full h-auto max-h-[60vh] object-contain" />
      </div>
    </motion.div>
  );
};

export default ImageCanvas;
