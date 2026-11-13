import { useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import durationAtom from 'state/duration.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { styled } from 'styled-components';

interface ICurrentSectionWrapper {
  left: string;
  width: string;
}

const CurrentSectionWrapper = styled.div<ICurrentSectionWrapper>`
  left: ${({ left }) => left};
  position: absolute;
  height: 100%;
  width: ${({ width }) => width};
  opacity: 0.4;
  background-color: ${({ theme }) => theme.workerColor.primary};
`;

interface ICurrentSection {
  startTime: number;
  endTime: number;
}

const CurrentSection: React.FC<ICurrentSection> = ({ startTime, endTime }) => {
  const duration = useRecoilValue(durationAtom);
  const scrollWith = useRecoilValue(scrollWidthAtom);

  // const pxPerSec = scrollWith / duration;
  const pxPerSec = useMemo(() => scrollWith / duration, [scrollWith, duration]);

  const currentSectionRef = useRef(null);

  // if (!selectedSection.length) {
  //   return null;
  // }

  return <CurrentSectionWrapper ref={currentSectionRef} left={`${startTime * pxPerSec}px`} width={`${(endTime - startTime) * pxPerSec || 0}px`} />;
};

export default CurrentSection;
