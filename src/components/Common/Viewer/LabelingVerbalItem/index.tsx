import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import durationAtom from 'state/duration.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { styled } from 'styled-components';

import Divider from 'components/Common/Worker/Divider';

const LabelingVerbalItemWrapper = styled.div`
  .section-label {
    background: rgba(51, 64, 168, 0.4);
  }
  /* .sentence-box {
    width: 100%;
    text-align: center;
    padding: 0px 10px;
    position: relative;
  } */
  .sentence {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    font-size: ${({ theme }) => theme.fontSize.text_12};
    width: 100%;
    display: block;
    padding: 3px 0px 0px;
    text-align: center;
  }
`;

const ResizableSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 200;
  .divider-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    border-left: 1px solid ${({ theme }) => theme.workerColor.line2};
    border-right: 1px solid ${({ theme }) => theme.workerColor.line2};
    & > div {
      width: 100%;
      text-align: center;
      padding: 0px 10px;
      position: relative;
      .sentence {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        font-size: ${({ theme }) => theme.fontSize.text_12};
        width: 100%;
        display: block;
        padding: 3px 0px 0px;
        text-align: center;
      }
      & > input {
        width: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .remove-box {
    font-size: ${({ theme }) => theme.fontSize.text_12};
    padding: 4px 0px 4px 8px;
    width: 120px;
    position: absolute;
    bottom: 100%;
    left: 100%;
    border-radius: 4px;
    display: flex;
    background-color: ${({ theme }) => theme.workerColor.primary};
    color: ${({ theme }) => theme.workerColor.white};
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      margin-top: 1px;
    }
  }
`;

interface IResizableSection {
  startTime: number;
  endTime: number;
  sentence?: string;
  sectionId?: string;
}

const LabelingVerbalItem: React.FC<IResizableSection> = ({ startTime, endTime, sentence, sectionId }) => {
  const scrollWith = useRecoilValue(scrollWidthAtom);
  const duration = useRecoilValue(durationAtom);
  const [sectionStartTime, setSectionStartTime] = useState<number>(startTime);
  const [sectionEndTime, setSectionEndTime] = useState<number>(endTime);
  const setSeekingTime = useSetRecoilState(seekingTimeAtom);
  const setSelectedSection = useSetRecoilState(selectedSectionAtom);
  const setCurrentSection = useSetRecoilState(currentSectionAtom);

  const pxPerSec = scrollWith / duration;

  useEffect(() => {
    // 영역이 바뀔때 마다 시작점과 끝점을 업데이트
    setSectionStartTime(startTime);
    setSectionEndTime(endTime);
  }, [startTime, endTime]);

  if (!pxPerSec) {
    return null;
  }

  const handleClick = () => {
    setSeekingTime(sectionStartTime);
    setSelectedSection([]);
    if (sectionId) {
      setCurrentSection({
        id: sectionId,
        startTime: sectionStartTime,
        endTime: sectionEndTime,
      });
    }
  };

  return (
    <LabelingVerbalItemWrapper>
      <Rnd
        position={{
          x: sectionStartTime * pxPerSec,
          y: 0,
        }}
        size={{
          width: (sectionEndTime - sectionStartTime) * pxPerSec,
          height: 24,
        }}
        dragAxis="x"
        enableResizing={{
          left: false,
          right: false,
        }}
        disableDragging
      >
        <ResizableSectionWrapper onClick={handleClick} style={{ cursor: sectionId ? 'pointer' : 'default' }}>
          <div className="divider-box">
            <div />
            <Divider orientation="horizontal" width="100%" color="#aaaeb2" mt="20px" />
          </div>
        </ResizableSectionWrapper>
      </Rnd>
      {sentence && (
        <div
          className="sentence-box"
          style={{
            transform: `translate(${sectionStartTime * pxPerSec}px, 0px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: (sectionEndTime - sectionStartTime) * pxPerSec,
            padding: '0px 10px',
            cursor: sectionId ? 'pointer' : 'default',
          }}
          onClick={handleClick}
        >
          <span className="sentence">{sentence}</span>
        </div>
      )}
    </LabelingVerbalItemWrapper>
  );
};

export default LabelingVerbalItem;
