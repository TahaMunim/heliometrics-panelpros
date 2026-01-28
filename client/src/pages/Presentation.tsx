import { useRef, useState, useEffect } from "react";
import { useSlides } from "@/hooks/use-slides";
import { NavigationControls } from "@/components/NavigationControls";
import { SlideViewer } from "@/components/SlideViewer";
import { Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Presentation() {
  const { data: slides, isLoading, error } = useSlides();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);

  // Handle scroll events to update active index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling.current) return;
      
      const height = container.clientHeight;
      const scrollPosition = container.scrollTop;
      const index = Math.round(scrollPosition / height);
      
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    };

    // Debounce scroll handler slightly for performance
    let timeoutId: number;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleScroll, 50);
    };

    container.addEventListener("scroll", debouncedScroll);
    return () => {
      container.removeEventListener("scroll", debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [activeIndex]);

  const scrollToSlide = (index: number) => {
    if (!containerRef.current || !slides) return;
    
    // Clamp index
    const targetIndex = Math.max(0, Math.min(index, slides.length - 1));
    
    isScrolling.current = true;
    setActiveIndex(targetIndex);
    
    containerRef.current.scrollTo({
      top: targetIndex * containerRef.current.clientHeight,
      behavior: "smooth",
    });

    // Reset scrolling flag after animation finishes (approximate)
    setTimeout(() => {
      isScrolling.current = false;
    }, 800);
  };

  const handleNext = () => scrollToSlide(activeIndex + 1);
  const handlePrev = () => scrollToSlide(activeIndex - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, slides]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-display font-bold mb-2">Preparing Presentation</h2>
        <p className="text-muted-foreground">Loading slides and assets...</p>
      </div>
    );
  }

  if (error || !slides) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="bg-destructive/10 p-6 rounded-2xl max-w-md text-center border border-destructive/20">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-destructive mb-2">Unable to Load Presentation</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while fetching the presentation slides. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
        <p className="text-xl text-muted-foreground font-light">No slides available.</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Main Scroll Container */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-auto overflow-x-hidden snap-y-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {slides.map((slide, index) => (
          <SlideViewer 
            key={slide.id} 
            slide={slide} 
            isActive={activeIndex === index}
          />
        ))}
      </div>

      {/* Overlay Navigation */}
      <NavigationControls
        currentSlideIndex={activeIndex}
        totalSlides={slides.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onGoTo={scrollToSlide}
      />
      
      {/* Slide Counter Overlay */}
      <div className="fixed top-6 left-8 z-50 pointer-events-none mix-blend-difference text-white">
        <span className="font-mono text-sm tracking-wider opacity-60">SLIDE</span>
        <div className="text-3xl font-display font-bold">
          {String(activeIndex + 1).padStart(2, '0')}
          <span className="text-lg opacity-40 font-normal mx-1">/</span>
          <span className="text-lg opacity-40 font-normal">{String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}
