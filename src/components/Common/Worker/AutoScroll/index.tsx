import React, { ReactNode, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import { scrollLeftAtom } from 'state/scrollLeft.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { timeAtom } from 'state/time.atom';
import { styled } from 'styled-components';

import CurrentSection from '../CurrentSection';

const AutoScrollWrapper = styled.div<{ width: string }>`
  overflow: auto;
  width: 1488px;
  margin-top: -154px;
  /* hide native scrollbar */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
  .area-box {
    width: ${({ width }) => width};
    height: 100%;
    position: relative;
    .progress-box {
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      overflow: hidden;
    }
    .cursor-box {
      position: absolute;
      top: 0;
      z-index: 1000;
      width: 1px;
      height: 100%;
      background: red;
    }
  }
`;

interface AutoScrollContainerProps {
  currentTime?: number;
  totalTime: number;
  isPlaying?: boolean;
  children: ReactNode;
}

const AutoScroll: React.FC<AutoScrollContainerProps> = ({ totalTime, isPlaying = false, children }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ignoreScrollEventRef = useRef(false);

  const currentTime = useRecoilValue(timeAtom);
  const scrollWidth = useRecoilValue(scrollWidthAtom);
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const setScrollLeft = useSetRecoilState(scrollLeftAtom);
  // const selectedSection = useRecoilValue(selectedSectionAtom);
  const currentSection = useRecoilValue(currentSectionAtom);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const cursor = cursorRef.current;

    if (!scrollContainer || !cursor) return;
    // 재생 될때 시간 계산
    const progress = currentTime / totalTime / 10;

    // 시간 계산으로 커서 위치 계산
    const progressWidth = scrollWidth * progress;

    // 커서 위치 계산으로 커서 위치 설정
    const cursorPosition = progressWidth / scrollWidth;
    cursor.style.left = `${cursorPosition > 99.999 ? 99.999 : cursorPosition}%`;
    if (progressRef.current) {
      progressRef.current.style.width = `${cursorPosition}%`;
    }
  }, [currentTime, totalTime, isPlaying, scrollWidth]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    ignoreScrollEventRef.current = true;
    scrollContainerRef.current.scrollLeft = scrollLeft;
    // allow native scroll events triggered by programmatic scroll to be ignored for one frame
    requestAnimationFrame(() => {
      ignoreScrollEventRef.current = false;
    });
  }, [scrollLeft]);

  const handleScroll = () => {
    if (ignoreScrollEventRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    setScrollLeft(container.scrollLeft);
  };

  return (
    <AutoScrollWrapper ref={scrollContainerRef} width={`${scrollWidth || 0}px`} onScroll={handleScroll}>
      <div className="area-box">
        <div ref={progressRef} className="progress-box" />
        <div ref={cursorRef} className="cursor-box" />
        {currentSection && <CurrentSection startTime={currentSection.startTime} endTime={currentSection.endTime} />}
        {children}
      </div>
    </AutoScrollWrapper>
  );
};

export default AutoScroll;
