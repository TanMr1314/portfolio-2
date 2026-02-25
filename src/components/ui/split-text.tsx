'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  from?: { opacity?: number; y?: number; x?: number; rotateX?: number; rotateY?: number; scale?: number };
  to?: { opacity?: number; y?: number; x?: number; rotateX?: number; rotateY?: number; scale?: number };
  threshold?: number;
  textAlign?: 'left' | 'center' | 'right';
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  splitType?: 'chars' | 'words' | 'chars,words';
  onLetterAnimationComplete?: () => void;
}

export function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 0.8,
  ease = 'power3.out',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = 'center',
  tag = 'p',
  splitType = 'chars',
  onLetterAnimationComplete,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const animationCompletedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check fonts on mount - using async callback pattern
    let mounted = true;
    
    const checkFonts = async () => {
      try {
        if (document.fonts.status === 'loaded') {
          if (mounted) setIsReady(true);
        } else {
          await document.fonts.ready;
          if (mounted) setIsReady(true);
        }
      } catch {
        // Fallback if fonts API fails
        if (mounted) setIsReady(true);
      }
    };
    
    checkFonts();
    
    return () => {
      mounted = false;
    };
  }, []);

  const runAnimation = useCallback(() => {
    if (!ref.current || !text || !isReady) return;
    if (animationCompletedRef.current) return;

    const elements = ref.current.querySelectorAll('.split-char');
    if (elements.length === 0) return;

    // Set initial state
    gsap.set(elements, {
      opacity: from.opacity ?? 0,
      y: from.y ?? 0,
      x: from.x ?? 0,
      rotateX: from.rotateX ?? 0,
      rotateY: from.rotateY ?? 0,
      scale: from.scale ?? 1,
    });

    // Animate to final state
    gsap.to(elements, {
      opacity: to.opacity ?? 1,
      y: to.y ?? 0,
      x: to.x ?? 0,
      rotateX: to.rotateX ?? 0,
      rotateY: to.rotateY ?? 0,
      scale: to.scale ?? 1,
      duration,
      ease,
      stagger: delay / 1000,
      onComplete: () => {
        animationCompletedRef.current = true;
        onLetterAnimationComplete?.();
      },
    });
  }, [text, delay, duration, ease, from, to, isReady, onLetterAnimationComplete]);

  useEffect(() => {
    runAnimation();
  }, [runAnimation]);

  // Split text into words or characters
  const splitContent = () => {
    if (splitType === 'words') {
      const words = text.split(' ');
      return words.map((word, wordIndex) => (
        <span key={wordIndex} className="split-word" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {word}
          {wordIndex < words.length - 1 && '\u00A0'}
        </span>
      ));
    }

    // Default: split by characters
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="split-char"
        style={{
          display: 'inline-block',
          willChange: 'transform, opacity',
          whiteSpace: char === ' ' ? 'pre' : 'normal',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const containerStyle: React.CSSProperties = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity',
    perspective: '1000px',
  };

  const Tag = tag;

  return (
    <Tag ref={ref} style={containerStyle} className={`split-parent ${className}`}>
      {splitContent()}
    </Tag>
  );
}

export default SplitText;
