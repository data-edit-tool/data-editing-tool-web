import { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import durationAtom from 'state/duration.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { styled } from 'styled-components';

import { IVoiceMeasurements } from 'types/worker-interface';

const LabelingLoudnessWaveWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 52px;
  background-color: #222a36;
  margin-top: 12px;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

type LabelingLoudnessWaveProps = {
  voiceMeasurements?: IVoiceMeasurements[];
};

const LOUDNESS_PADDING = 6;
const SEGMENT_CSS_WIDTH = 1500; // canvas tiling width to keep backing store small
type Segment = { left: number; width: number };
type SegmentCanvasProps = {
  segment: Segment;
  duration: number;
  pxPerSec: number;
  points: { timeSec: number; loudness: number }[];
  minLoud: number;
  maxLoud: number;
};

const downsamplePoints = (points: { x: number; y: number }[], maxPoints: number) => {
  if (!points.length || maxPoints <= 0) return [];
  const stride = Math.max(1, Math.ceil(points.length / maxPoints));
  const sampled = [];
  for (let i = 0; i < points.length; i += stride) {
    sampled.push(points[i]);
  }
  if (sampled[sampled.length - 1] !== points[points.length - 1]) {
    sampled.push(points[points.length - 1]);
  }
  return sampled;
};

const LabelingLoudnessWave = ({ voiceMeasurements = [] }: LabelingLoudnessWaveProps) => {
  const duration = useRecoilValue(durationAtom);
  const scrollWidth = useRecoilValue(scrollWidthAtom);

  const loudnessPoints = useMemo(() => {
    return voiceMeasurements.map((item) => ({
      timeSec: item.offset_millis / 1000,
      loudness: Number(item.loudness) || 0,
    }));
  }, [voiceMeasurements]);

  const { minLoud, maxLoud } = useMemo(() => {
    const values = loudnessPoints.map((p) => p.loudness).filter((val) => val > 0);
    return {
      minLoud: values.length ? Math.min(...values) : 0,
      maxLoud: values.length ? Math.max(...values) : 0,
    };
  }, [loudnessPoints]);

  const pxPerSec = useMemo(() => (duration ? scrollWidth / duration : 0), [scrollWidth, duration]);
  const segments: Segment[] = useMemo(() => {
    if (!scrollWidth) return [];
    const count = Math.max(1, Math.ceil(scrollWidth / SEGMENT_CSS_WIDTH));
    return Array.from({ length: count }, (_, i) => {
      const left = i * SEGMENT_CSS_WIDTH;
      const width = Math.min(SEGMENT_CSS_WIDTH, scrollWidth - left);
      return { left, width };
    });
  }, [scrollWidth]);

  const SegmentCanvas = ({ segment, duration, pxPerSec, points, minLoud, maxLoud }: SegmentCanvasProps) => {
    const { left, width } = segment;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !duration || !pxPerSec || !points.length || !minLoud || !maxLoud) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const cssHeight = canvas.parentElement?.clientHeight ?? 52;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${cssHeight}px`;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(cssHeight * dpr));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, cssHeight);

      const loudnessRange = Math.max(1e-6, maxLoud - minLoud);
      const lineWidth = 1.5;
      const minY = LOUDNESS_PADDING + lineWidth;
      const maxY = cssHeight - LOUDNESS_PADDING - lineWidth;
      const usableHeight = Math.max(1, maxY - minY);
      const toY = (loudness: number) => maxY - ((loudness - minLoud) / loudnessRange) * usableHeight;

      const pointsInSegment = points.reduce<{ x: number; y: number }[]>((acc, { timeSec, loudness }) => {
        const x = timeSec * pxPerSec;
        if (x < left || x > left + width) return acc;
        if (loudness <= 0) return acc;
        acc.push({ x: x - left, y: toY(loudness) });
        return acc;
      }, []);

      const samples = downsamplePoints(pointsInSegment, Math.max(1, Math.floor(width)));

      ctx.lineWidth = lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#f5d87d';
      ctx.beginPath();

      let drawing = false;
      samples.forEach(({ x, y }) => {
        if (!drawing) {
          ctx.moveTo(x, y);
          drawing = true;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }, [duration, pxPerSec, points, minLoud, maxLoud, left, width]);

    return <canvas ref={canvasRef} style={{ position: 'absolute', left }} />;
  };

  return (
    <LabelingLoudnessWaveWrapper style={{ width: scrollWidth ? `${scrollWidth}px` : '100%' }}>
      {segments.map((segment) => (
        <SegmentCanvas
          key={segment.left}
          segment={segment}
          duration={duration}
          pxPerSec={pxPerSec}
          points={loudnessPoints}
          minLoud={minLoud}
          maxLoud={maxLoud}
        />
      ))}
    </LabelingLoudnessWaveWrapper>
  );
};

export default LabelingLoudnessWave;
