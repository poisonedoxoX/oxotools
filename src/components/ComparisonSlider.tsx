import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ComparisonSliderProps {
  originalSrc: string;
  editedSrc: string;
  hasTransparency?: boolean;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ originalSrc, editedSrc, hasTransparency }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-1 md:p-4 bg-surface rounded-xl md:rounded-[20px] shadow-stack"
    >
      <div
        ref={containerRef}
        className={`relative rounded-[12px] overflow-hidden outline outline-1 outline-foreground/10 -outline-offset-1 select-none cursor-col-resize ${hasTransparency ? 'checkerboard' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* Edited (full) */}
        <img src={editedSrc} alt="Edited" className="block w-full h-auto max-h-[60vh] object-contain" />

        {/* Original (clipped) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img src={originalSrc} alt="Original" className="block w-full h-auto max-h-[60vh] object-contain" />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-foreground/80"
          style={{ left: `${position}%`, transform: 'translateX(-50%)', willChange: 'transform' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-foreground/90 border-2 border-background shadow-lg" />
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 text-[10px] font-medium tracking-wider uppercase text-foreground/60 bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
          Original
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-medium tracking-wider uppercase text-foreground/60 bg-background/60 backdrop-blur-sm px-2 py-1 rounded">
          Edited
        </span>
      </div>
    </motion.div>
  );
};

export default ComparisonSlider;
