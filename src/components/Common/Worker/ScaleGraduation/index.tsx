import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import durationAtom from 'state/duration.atom';
import { scrollLeftAtom } from 'state/scrollLeft.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';

const TimeRulerContainer = styled.div`
  width: 100%;
  height: 30px;
  padding-bottom: 0;
  position: relative;
  display: flex;
  align-items: flex-end;
  z-index: 3;
  overflow: visible;
`;

const CanvasElement = styled.canvas`
  display: block;
  height: 30px; /* CSS pixels */
  position: absolute;
  bottom: 0;
  z-index: 4;
`;

const CANVAS_CSS_HEIGHT = 30; // CSS px
const VIEWPORT_CSS_WIDTH = 1488; // must match AutoScroll wrapper width
const MAX_BACKING_WIDTH = 65000; // per-dimension safety limit
const EXTRA_QUALITY = 2; // supersampling factor (1.5~2 is safe)

const ScaleGraduation: React.FC = () => {
  const duration = useRecoilValue(durationAtom);
  const scrollWidth = useRecoilValue(scrollWidthAtom); // full timeline CSS width
  const scrollLeft = useRecoilValue(scrollLeftAtom);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(Math.floor(remainingSeconds)).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !duration || !scrollWidth) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    // Render only the visible viewport section for crispness
    const cssWidth = VIEWPORT_CSS_WIDTH;
    const cssHeight = CANVAS_CSS_HEIGHT;

    // Backing-store scale (physical pixels per CSS pixel)
    const scale = Math.max(1, dpr * EXTRA_QUALITY);

    // Clamp the backing-store width under browser limit
    const backingCssWidth = Math.max(1, Math.min(cssWidth, Math.floor(MAX_BACKING_WIDTH / scale) - 2));

    // Apply CSS size
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    // Apply backing-store size (real pixels)
    canvas.width = Math.ceil(backingCssWidth * scale);
    canvas.height = Math.ceil(cssHeight * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset and scale so our drawing units are CSS pixels
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Horizontal scale so the (smaller) backing-store maps to the (larger) CSS width
    const scaleX = (backingCssWidth * scale) / cssWidth;
    const scaleY = scale;
    ctx.scale(scaleX, scaleY);

    // Clear in CSS units
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = '#adafc1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    // Keep nominal font size in CSS px; `scale` provides the resolution
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    (ctx as any).imageSmoothingEnabled = false;

    const pxPerSecFull = scrollWidth / duration; // CSS px per second across full timeline
    const viewportStartSec = scrollLeft / pxPerSecFull;
    const pxPerSec = pxPerSecFull; // drawing scale in CSS px

    const timeInterval = 0.1; // 0.1s ticks
    const minPxBetweenMinor = 2; // avoid excessive overdrawing
    const drawMinor = pxPerSec * timeInterval >= minPxBetweenMinor;

    // Helpers for crisp 1 physical px
    const onePxX = 1 / scaleX;
    const toCrispX = (xCss: number) => (Math.floor(xCss * scaleX) + 0.5) / scaleX;

    // Determine indices overlapping the viewport
    const startIndex = Math.max(0, Math.floor(viewportStartSec / timeInterval) - 1);
    const endSec = viewportStartSec + cssWidth / pxPerSec;
    const endIndex = Math.min(Math.floor(duration / timeInterval), Math.ceil(endSec / timeInterval) + 1);

    for (let idx = startIndex; idx <= endIndex; idx++) {
      const sec = idx * timeInterval;
      const x = (sec - viewportStartSec) * pxPerSec;
      const isPrimary = idx % 10 === 0; // 1s ticks

      if (isPrimary || drawMinor) {
        const tickHeight = isPrimary ? 20 : 10;
        const y = isPrimary ? 20 : 15;
        const X = toCrispX(x);
        ctx.fillRect(X, y - tickHeight, onePxX, tickHeight);
      }

      if (isPrimary) {
        if (sec === 0) {
          ctx.textAlign = 'left';
          const textX = Math.round(Math.max(0, x - 1) * scaleX) / scaleX;
          ctx.fillText(formatTime(sec), textX, cssHeight);
          ctx.textAlign = 'center';
        } else if (x > 12 && x < cssWidth - 12) {
          const textX = Math.round(x * scaleX) / scaleX;
          ctx.fillText(formatTime(sec), textX, cssHeight);
        }
      }
    }
  }, [duration, scrollWidth, scrollLeft]);

  return (
    <TimeRulerContainer style={{ width: `${Math.max(1, Math.floor(scrollWidth || 0))}px` }}>
      <CanvasElement ref={canvasRef} style={{ width: `${VIEWPORT_CSS_WIDTH}px`, left: `${Math.floor(scrollLeft)}px` }} />
    </TimeRulerContainer>
  );
};

export default ScaleGraduation;
