import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import durationAtom from 'state/duration.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { workerInputOpenIdSelector } from 'state/worker-input-open-id';
import { workerLabelingListSelector, workerLabelingVerbalResizeListSelector } from 'state/worker-labeling';
import { workerLabelingHistoryIndexSelector, workerLabelingHistoryListSelector } from 'state/worker-labeling-history-list';
import { workerTypeSelector } from 'state/worker-project';
import { workerSpeakerSelector } from 'state/worker-speaker';
import styled from 'styled-components';
import { ILabelingAll } from 'types/worker-interface';

import ResizableSection from '../ResizableSection';

const ResizableWrapper = styled.div<{ backgroundcolor: string }>`
  display: flex;
  width: 100%;
  height: 32px;
  ${({ backgroundcolor }) => backgroundcolor && `background-color: ${backgroundcolor};`}
  position: relative;
  /* contain: layout paint; */
`;

interface IResizableSections {
  labelingList: ILabelingAll[];
  labelingId: string;
  speakerId: string;
  onResize: (id: string, newStartTime: number, newEndTime: number, type?: string) => void;
  disableDragging?: boolean;
  backgroundColor: string;
  paraverbalFuncId?: string;
  nonVerbalSubjectId?: string;
  type?: string;
  step: number | null;
  viewportStartSec?: number;
  viewportEndSec?: number;
  overscanSec?: number;
}

const ResizableSections: React.FC<IResizableSections> = ({
  labelingList,
  onResize,
  backgroundColor,
  labelingId,
  speakerId,
  paraverbalFuncId,
  nonVerbalSubjectId,
  type,
  disableDragging = false,
  step,
  viewportStartSec,
  viewportEndSec,
  overscanSec = 2,
}) => {
  const [allLabelingList, setAllLabelingList] = useRecoilState(workerLabelingListSelector);
  const [verbalLabelingList, setVerbalLabelingList] = useRecoilState(workerLabelingVerbalResizeListSelector);
  const setIsInputOpenId = useSetRecoilState(workerInputOpenIdSelector);

  const duration = useRecoilValue(durationAtom);
  const scrollWith = useRecoilValue(scrollWidthAtom);
  // const editLabelingId = useRecoilValue(workerLabelingSelectEditLabelingSelector);
  const workerType = useRecoilValue(workerTypeSelector);
  const labelHistoryIndex = useRecoilValue(workerLabelingHistoryIndexSelector);
  const [labelHistoryList, setLabelHistoryList] = useRecoilState(workerLabelingHistoryListSelector);
  const selectSpeaker = useRecoilValue(workerSpeakerSelector);
  const currentSection = useRecoilValue(currentSectionAtom);

  const pxPerSec = scrollWith / duration;

  const visibleIndices = React.useMemo(() => {
    if (!labelingList || labelingList.length === 0) return [] as number[];
    if (viewportStartSec == null || viewportEndSec == null) {
      return labelingList.map((_, idx) => idx);
    }
    const start = viewportStartSec - (overscanSec ?? 0);
    const end = viewportEndSec + (overscanSec ?? 0);
    const result: number[] = [];
    for (let i = 0; i < labelingList.length; i++) {
      const item = labelingList[i];
      const s = item.start_time / 1000;
      const e = item.end_time / 1000;
      if (!(e < start || s > end)) {
        result.push(i);
      }
    }
    return result;
  }, [labelingList, viewportStartSec, viewportEndSec, overscanSec]);

  const handleAddLabeling: React.MouseEventHandler<HTMLDivElement> = (e) => {
    let check = true;
    if (!currentSection) {
      return;
    }
    if (currentSection) {
      // 클릭한영역의 x값을 가져옴
      const clickedX = (e.nativeEvent as any).layerX;
      // 영역 선택이 안되어있을 경우
      if (currentSection.startTime === 0 && currentSection.endTime === 0) return;
      // 해당 영역이 아닌곳에서 클릭했을 경우
      if (currentSection.startTime * pxPerSec > clickedX || currentSection.endTime * pxPerSec < clickedX) return;

      // 해당 영역에 다른 영역이 있을 경우

      labelingList.forEach((labeling) => {
        if (!(currentSection.endTime <= labeling.start_time / 1000 || currentSection.startTime >= labeling.end_time / 1000)) {
          check = false;
        }
      });
    }
    if (!check) {
      return;
    }

    // step에 따른 추가 및 수정
    if (step === 1) {
      if (workerType === 'V') {
        return;
      }
      // 서버는 숫자+문자 조합인데 클라이언트에서 우선 추가할 경우 숫자로만 추가 (나중에 서버에 보낼값 체크하기 위함)
      const randomVerbalId = String(Math.ceil(Math.random() * 10000000));
      setIsInputOpenId(randomVerbalId);
      const newLabelingList = [
        ...allLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false })),
        {
          labeling_id: labelingId,
          speaker_id: speakerId,
          start_time: Math.ceil(currentSection.startTime * 1000),
          end_time: Math.ceil(currentSection.endTime * 1000),
          verbal_id: randomVerbalId,
          active: true,
          selected: true,
        } as any,
      ];
      const newLabelingHistoryList = [...labelHistoryList];
      const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);
      setLabelHistoryList([...newLabelingHistorySpliceList, { type: 'edit', data: JSON.stringify(newLabelingList), selectSpeaker }]);
      setAllLabelingList(newLabelingList);
    } else if (step === 2 && paraverbalFuncId) {
      if (workerType === 'V') return;
      if (currentSection) {
        // 서버는 숫자+문자 조합인데 클라이언트에서 우선 추가할 경우 숫자로만 추가 (나중에 서버에 보낼값 체크하기 위함)
        const randomParaverbalId = String(Math.ceil(Math.random() * 10000000));
        const newLabelingList = [
          ...allLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false })),
          {
            labeling_id: labelingId,
            speaker_id: speakerId,
            start_time: Math.ceil(currentSection?.startTime * 1000),
            end_time: Math.ceil(currentSection?.endTime * 1000),
            paraverbal_id: randomParaverbalId,
            func: paraverbalFuncId,
            active: true,
            selected: true,
          } as any,
        ];
        const newLabelingHistoryList = [...labelHistoryList];
        const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);
        setLabelHistoryList([
          ...newLabelingHistorySpliceList,
          {
            type: 'edit',
            data: JSON.stringify(newLabelingList),
            verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
            selectSpeaker,
          },
        ]);
        setAllLabelingList(newLabelingList);
      }
    } else if (step === 3 && nonVerbalSubjectId) {
      if (workerType === 'V') return;
      if (currentSection) {
        // 서버는 숫자+문자 조합인데 클라이언트에서 우선 추가할 경우 숫자로만 추가 (나중에 서버에 보낼값 체크하기 위함)
        const randomNonVerbalId = String(Math.ceil(Math.random() * 10000000));
        const newLabelingList = [
          ...allLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false })),
          {
            labeling_id: labelingId,
            speaker_id: speakerId,
            start_time: Math.ceil(currentSection?.startTime * 1000),
            end_time: Math.ceil(currentSection?.endTime * 1000),
            nonverbal_id: randomNonVerbalId,
            subject: nonVerbalSubjectId,
            active: true,
            selected: true,
          } as any,
        ];
        const newLabelingHistoryList = [...labelHistoryList];
        const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);
        setLabelHistoryList([
          ...newLabelingHistorySpliceList,
          {
            type: 'edit',
            data: JSON.stringify(newLabelingList),
            verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
            selectSpeaker,
          },
        ]);
        setAllLabelingList(newLabelingList);
      }
    }
  };

  // verbal에서 해당 라벨 수정
  const handleAddLabelingSentence = (sentence: string, verbalId: string, type?: string) => {
    if (step === 1) {
      const labelingData = allLabelingList.find((labeling) => verbalId === labeling.verbal_id);

      if (labelingData) {
        const newLabeling = {
          ...labelingData,
          sentence,
          speaker_id: speakerId,
          labeling_id: labelingId,
        };

        const newLabelingList = allLabelingList.map((labeling) =>
          labeling.verbal_id === verbalId ? { ...newLabeling, active: true, selected: true } : { ...labeling, active: false, selected: false },
        );
        const newLabelingHistoryList = [...labelHistoryList];

        const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

        setLabelHistoryList([...newLabelingHistorySpliceList, { type: 'edit', data: JSON.stringify(newLabelingList), selectSpeaker }]);

        setAllLabelingList(newLabelingList);
      }
    } else if (type === 'step') {
      const labelingData = verbalLabelingList.find((labeling) => verbalId === labeling.verbal_id);
      if (labelingData) {
        const newLabeling = {
          ...labelingData,
          sentence,
          speaker_id: speakerId,
          labeling_id: labelingId,
        };

        const newLabelingList = verbalLabelingList.map((labeling) =>
          labeling.verbal_id === verbalId ? { ...newLabeling, active: true, selected: true } : { ...labeling, active: false, selected: false },
        );
        const newLabelingHistoryList = [...labelHistoryList];

        const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

        setLabelHistoryList([
          ...newLabelingHistorySpliceList,
          {
            type: 'edit',
            data: JSON.stringify(allLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
            verbal: JSON.stringify(newLabelingList),
            selectSpeaker,
          },
        ]);

        setVerbalLabelingList(newLabelingList);
      }
    }
  };

  return (
    <ResizableWrapper backgroundcolor={backgroundColor} onDoubleClick={handleAddLabeling}>
      {visibleIndices.map((index) => {
        const data = labelingList[index];
        const id = () => {
          if (type === 'step') {
            return data.verbal_id ?? index;
          } else if (step === 1) {
            return data.verbal_id ?? index;
          } else if (step === 2) {
            return `${paraverbalFuncId} - ${data.paraverbal_id}`;
          } else if (step === 3) {
            return `${nonVerbalSubjectId} - ${data.nonverbal_id}`;
          } else {
            return index;
          }
        };
        const subId = () => {
          if (step === 1 || type === 'step') {
            return data.verbal_id;
          } else if (step === 2) {
            return data.paraverbal_id;
          } else {
            return data.nonverbal_id;
          }
        };
        return (
          <ResizableSection
            key={`verbal-resizable-${id()}`}
            beforeEndTime={labelingList?.[index - 1] ? labelingList[index - 1].end_time / 1000 : 0}
            afterStartTime={labelingList?.[index + 1] ? labelingList[index + 1].start_time / 1000 : duration}
            startTime={data.start_time / 1000}
            endTime={data.end_time / 1000}
            onResize={onResize}
            disableDragging={disableDragging}
            id={subId()}
            verbalId={data.verbal_id}
            sentence={data.sentence}
            type={type}
            handleAddLabelingSentence={handleAddLabelingSentence}
          />
        );
      })}
    </ResizableWrapper>
  );
};

export default ResizableSections;
