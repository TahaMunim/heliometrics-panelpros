import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationControlsProps {
  currentSlideIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export function NavigationControls({
  currentSlideIndex,
  totalSlides,
  onPrev,
  onNext,
  onGoTo,
}: NavigationControlsProps) {
  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPrev}
          disabled={currentSlideIndex === 0}
          className="p-3 rounded-full bg-secondary/80 text-foreground backdrop-blur-sm border border-white/10 shadow-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"
          aria-label="Previous Slide"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          disabled={currentSlideIndex === totalSlides - 1}
          className="p-3 rounded-full bg-secondary/80 text-foreground backdrop-blur-sm border border-white/10 shadow-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"
          aria-label="Next Slide"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Progress Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 hidden md:flex">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onGoTo(index)}
            className="group relative flex items-center justify-end"
            aria-label={`Go to slide ${index + 1}`}
            initial={false}
          >
            {/* Label on hover */}
            <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium text-white/70 bg-black/50 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap mr-2 pointer-events-none">
              Slide {index + 1}
            </span>
            
            {/* Dot */}
            <motion.div
              animate={{
                scale: currentSlideIndex === index ? 1.2 : 1,
                opacity: currentSlideIndex === index ? 1 : 0.4,
                backgroundColor: currentSlideIndex === index ? "var(--primary)" : "#ffffff"
              }}
              className={`w-3 h-3 rounded-full shadow-sm transition-colors duration-300 ${
                currentSlideIndex === index ? "bg-primary" : "bg-white hover:bg-white/80"
              }`}
            />
          </motion.button>
        ))}
      </div>
      
      {/* Progress Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </>
  );
}
