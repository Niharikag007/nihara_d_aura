import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HorizontalScroll({
  children,
  label,
  className = '',
  viewportClassName = '',
  contentClassName = ''
}) {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    hasOverflow: false,
    canScrollLeft: false,
    canScrollRight: false
  });

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    const nextState = {
      hasOverflow: maxScrollLeft > 1,
      canScrollLeft: element.scrollLeft > 1,
      canScrollRight: maxScrollLeft - element.scrollLeft > 1
    };

    setScrollState((current) => (
      current.hasOverflow === nextState.hasOverflow
        && current.canScrollLeft === nextState.canScrollLeft
        && current.canScrollRight === nextState.canScrollRight
        ? current
        : nextState
    ));
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;

    updateScrollState();
    element.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateScrollState);
    resizeObserver?.observe(element);
    if (element.firstElementChild) resizeObserver?.observe(element.firstElementChild);

    return () => {
      element.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (direction) => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollBy({
      left: direction * Math.max(element.clientWidth * 0.75, 120),
      behavior: 'smooth'
    });
  };

  const arrowClassName = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DFBC77]/70 bg-[#FCF9F2] text-[#855F14] shadow-sm transition-colors hover:border-[#C59B27] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B27] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      {scrollState.hasOverflow && (
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={!scrollState.canScrollLeft}
          aria-label={`Scroll ${label} left`}
          title={`Previous ${label}`}
          className={arrowClassName}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <div
        ref={scrollRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`min-w-0 flex-1 overflow-x-auto scrollbar-none ${viewportClassName}`}
      >
        <div className={`flex w-max min-w-full items-center ${contentClassName}`}>
          {children}
        </div>
      </div>
      {scrollState.hasOverflow && (
        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={!scrollState.canScrollRight}
          aria-label={`Scroll ${label} right`}
          title={`Next ${label}`}
          className={arrowClassName}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
