// components/images/ImageCarousel/hooks/useSwipe.ts
import { useState, useRef } from "react";

interface SwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe<T extends HTMLElement>({
  threshold = 50,
  onSwipeLeft,
  onSwipeRight,
}: SwipeOptions = {}) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const elementRef = useRef<T>(null);

  const handleTouchStart = (e: React.TouchEvent | TouchEvent) => {
    const clientX =
      "touches" in e
        ? e.touches[0].clientX
        : (e as TouchEvent).targetTouches[0].clientX;
    setTouchStart(clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isSwiping) return;
    const clientX =
      "touches" in e
        ? e.touches[0].clientX
        : (e as TouchEvent).targetTouches[0].clientX;
    setTouchEnd(clientX);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      setSwipeDirection("left");
      onSwipeLeft();
      setTimeout(() => setSwipeDirection(null), 300);
    }

    if (isRightSwipe && onSwipeRight) {
      setSwipeDirection("right");
      onSwipeRight();
      setTimeout(() => setSwipeDirection(null), 300);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsSwiping(true);
    if (elementRef.current) {
      elementRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (elementRef.current) {
      elementRef.current.style.cursor = "grab";
    }
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    if (isSwiping && elementRef.current) {
      elementRef.current.style.cursor = "grab";
      handleTouchEnd();
    }
  };

  return {
    elementRef,
    swipeDirection,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  };
}
