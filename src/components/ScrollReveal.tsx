import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-in" | "slide-up" | "scale-in";

const variantClasses: Record<RevealVariant, string> = {
  "fade-in": "animate-fade-in",
  "slide-up": "animate-slide-up",
  "scale-in": "animate-scale-in",
};

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Stagger delay in milliseconds */
  delay?: number;
  className?: string;
}

const ScrollReveal = ({
  children,
  variant = "slide-up",
  delay = 0,
  className,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Once the entrance animation finishes, drop the animation class so its
  // fill-mode transform doesn't override hover transitions on this element.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        !visible && "opacity-0",
        visible && !settled && variantClasses[variant],
        className
      )}
      style={delay && !settled ? { animationDelay: `${delay}ms` } : undefined}
      onAnimationEnd={(event) => {
        if (event.target === ref.current) setSettled(true);
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
