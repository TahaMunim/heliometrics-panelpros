import { useState, useEffect, useRef } from "react";
import { Slide } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface SlideViewerProps {
  slide: Slide;
  isActive: boolean;
}

export function SlideViewer({ slide, isActive }: SlideViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset loading state when url changes
  useEffect(() => {
    setIsLoading(true);
  }, [slide.url]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <section className="h-screen w-full snap-center relative overflow-hidden bg-background">
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-background z-20"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">
                Loading Slide...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Content */}
      <iframe
        ref={iframeRef}
        src={slide.url}
        onLoad={handleLoad}
        title={slide.title}
        className="w-full h-full border-none block"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading={isActive ? "eager" : "lazy"}
      />
      
      {/* Overlay for inactive slides to prevent interaction stealing focus */}
      {!isActive && (
        <div className="absolute inset-0 bg-transparent z-10" />
      )}
    </section>
  );
}
