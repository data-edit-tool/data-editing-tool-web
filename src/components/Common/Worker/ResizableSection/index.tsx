import React, { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import durationAtom from 'state/duration.atom';
import { isPlayAtom } from 'state/isPlay.atom';
import { repeatAtom } from 'state/repeat.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { speakerSectionsAtom } from 'state/speaker-esction';
import { workerInputOpenIdSelector } from 'state/worker-input-open-id';
import { workerLabelingListSelector, workerLabelingMetaSelector, workerLabelingViewerStepSelector } from 'state/worker-labeling';
import { workerTypeSelector } from 'state/worker-project';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { ILabelingAll } from 'types/worker-interface';
import { useOnClickOutside } from 'usehooks-ts';
import { debounce } from 'utils/debounce';

import Delete from 'components/SVG/Icon/Delete';

import Divider from '../Divider';

const ResizableWrapper = styled.div`
  .section-label {
    background: rgba(51, 64, 168, 0.4);
  }
  /* position: relative; */
  .input-wrapper {
    min-width: 100px;
    max-width: 430px;
    z-index: 1;
    display: inline-block;
    position: absolute;
    top: 3px;
    left: 87px;
    min-height: 24px;
    background-color: ${theme.workerColor.white};
    border-radius: 4px;
    line-height: 20px;
    .input-outline {
      color: #141519;
      font-size: ${theme.fontSize.text_18};
      padding: 2px 10px;
      display: block;
      &:focus {
        outline: none;
      }
    }
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
  id: string;
  afterStartTime: number;
  beforeEndTime: number;
  startTime: number;
  endTime: number;
  onResize: (id: string, newStartTime: number, newEndTime: number, type?: string) => void;
  disableDragging?: boolean;
  verbalId: string;
  sentence: string;
  handleAddLabelingSentence: (sentence: string, id: string, type?: string) => void;
  type?: string;
}

const ResizableSection: React.FC<IResizableSection> = ({
  id,
  beforeEndTime,
  afterStartTime,
  startTime,
  endTime,
  onResize,
  disableDragging = false,
  verbalId,
  sentence,
  handleAddLabelingSentence,
  type,
}) => {
  const clickTimeoutRef = useRef<any | null>(null);
  const projectMeta = useRecoilValue(workerLabelingMetaSelector);
  const workerType = useRecoilValue(workerTypeSelector);
  const duration = useRecoilValue(durationAtom);
  const scrollWith = useRecoilValue(scrollWidthAtom);
  const pxPerSec = scrollWith / duration;
  const [sectionStartTime, setSectionStartTime] = useState<number>(startTime);
  const [sectionEndTime, setSectionEndTime] = useState<number>(endTime);
  const [labelingList, setLabelingList] = useRecoilState(workerLabelingListSelector);
  const [selectedSection, setSelectedSection] = useRecoilState(selectedSectionAtom);
  const setSectionData = useSetRecoilState(speakerSectionsAtom);
  const setSeekingTime = useSetRecoilState(seekingTimeAtom);
  const viewerStep = useRecoilValue(workerLabelingViewerStepSelector);
  const [step, setStep] = useState<number | null>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [isInputOpenId, setIsInputOpenId] = useRecoilState(workerInputOpenIdSelector);
  const [isVerbalSentence, setIsVerbalSentence] = useState<string>('');
  const isReplay = useRecoilState(repeatAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayAtom);
  const [isDrag, setIsDrag] = useState(false);
  const [showText, setShowText] = useState(false);
  const [currentSection, setCurrentSection] = useRecoilState(currentSectionAtom);

  useEffect(() => {
    if (isInputOpenId === verbalId) {
      setIsVerbalSentence(sentence);
      setTimeout(() => {
        if (spanRef.current && workerType !== 'V') {
          const textNode = spanRef.current.childNodes[0] as Text;
          const range = document.createRange();
          const selection = window.getSelection();
          if (textNode) {
            range.setStart(textNode, textNode.length);
            range.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(range);
          } else {
            spanRef.current.focus();
          }
        }
      }, 0);
    }
  }, [isInputOpenId, verbalId, sentence, workerType]);

  useEffect(() => {
    // 영역이 바뀔때 마다 시작점과 끝점을 업데이트
    setSectionStartTime(startTime);
    setSectionEndTime(endTime);
  }, [startTime, endTime]);

  useEffect(() => {
    // 작업자 타입에 따른 step 변경
    if (projectMeta && workerType) {
      if (workerType === 'W') {
        setStep(projectMeta?.step);
      } else if (workerType === 'V' || (workerType === 'C' && (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'IC'))) {
        setStep(viewerStep);
      } else if (workerType === 'C') {
        setStep(projectMeta?.check_step);
      }
    }
  }, [projectMeta?.step, projectMeta?.check_step, workerType, viewerStep, projectMeta?.work_status]);

  // During resize we only update local state; avoid Recoil writes until end
  const onSectionResizeDebounce = debounce((_direction: any, _newStartTime: number, _newEndTime: number) => {
    // no-op: kept for signature compatibility
  }, 50);

  const onSectionResize = (_: any, direction: any, ref: any, _delta: any, _position: any) => {
    if (direction === 'left') {
      const timeDifference = ref.offsetWidth / pxPerSec;
      const newStartTime = sectionEndTime - timeDifference;
      if (newStartTime <= beforeEndTime) {
        setSectionStartTime(beforeEndTime);
        return;
      }
      setSectionStartTime(newStartTime);
    } else {
      const timeDifference = ref.offsetWidth / pxPerSec;
      const newEndTime = sectionStartTime + timeDifference;
      if (newEndTime >= afterStartTime) {
        setSectionEndTime(afterStartTime);
        return;
      }
      setSectionEndTime(newEndTime);
    }
  };

  // During drag we keep updates local; commit on drag end only
  const debouncedCallback = debounce((_newStartTime: number, _newEndTime: number) => {
    // no-op: drag feedback handled locally; commit on end
  }, 50);

  const onSectionDrag = (_: any, data: any) => {
    setIsDrag(true);
    const newStartTime = data.x / pxPerSec;
    const newEndTime = (data.x + data.node.offsetWidth) / pxPerSec;
    // setSeekingTime(newStartTime);
    setSectionStartTime(newStartTime);
    setSectionEndTime(newEndTime);
    debouncedCallback(newStartTime, newEndTime);
  };

  // 시작점 끝점 마우스 놓았을때 이벤트
  const onResizeEnd = () => {
    onSectionResizeDebounce.cancel();
    if (!selectedSection.length) {
      setCurrentSection({
        id,
        startTime: sectionStartTime,
        endTime: sectionEndTime,
      });
    } else {
      setCurrentSection(null);
      const selectLabeling = selectedSection.find((section) => section.id === id);
      if (selectLabeling) {
        const newSelectedSection = selectedSection.map((section) => {
          if (section.id === id) {
            return {
              ...section,
              startTime: sectionStartTime,
              endTime: sectionEndTime,
            };
          }
          return section;
        });
        setSelectedSection(newSelectedSection);
      } else {
        setSelectedSection([
          {
            id,
            startTime: sectionStartTime,
            endTime: sectionEndTime,
          },
        ]);
      }
    }
    if (sectionStartTime === startTime && sectionEndTime === endTime) {
      return;
    }
    // 데이터 업데이트
    onResize(id, sectionStartTime * 1000, sectionEndTime * 1000, type);
  };

  // 드레그 마우스 놓았을때 이벤트
  const onSelectionDragEnd = () => {
    if (isDrag) {
      debouncedCallback.cancel();
      let updateStartTime = sectionStartTime;
      let updateEndTime = sectionEndTime;
      // 시작점이 이전 끝점보다 작은 경우
      if (sectionStartTime <= beforeEndTime) {
        updateStartTime = beforeEndTime;
        updateEndTime += beforeEndTime - sectionStartTime;
      }
      // 끝점이 이후 시작점보다 큰 경우
      if (sectionEndTime >= afterStartTime) {
        updateEndTime = afterStartTime;
        updateStartTime -= sectionEndTime - afterStartTime;
      }
      setSectionStartTime(updateStartTime);
      setSectionEndTime(updateEndTime);
      if (!selectedSection.length) {
        setCurrentSection({
          id,
          startTime: updateStartTime,
          endTime: updateEndTime,
        });
      } else {
        const selectLabeling = selectedSection.find((section) => section.id === id);
        if (selectLabeling) {
          const newSelectedSection = selectedSection.map((section) => {
            if (section.id === id) {
              return {
                ...section,
                startTime: updateStartTime,
                endTime: updateEndTime,
              };
            }
            return section;
          });
          setSelectedSection(newSelectedSection);
        } else {
          setSelectedSection([
            {
              id,
              startTime: updateStartTime,
              endTime: updateEndTime,
            },
          ]);
        }
        setCurrentSection(null);
      }
      if (startTime === updateStartTime && endTime === updateEndTime) {
        return;
      }
      setIsDrag(false);
      onResize(id, updateStartTime * 1000, updateEndTime * 1000, type);
    }
  };

  // 마우스 오른쪽 버튼
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    setSelectedSection([
      {
        id,
        startTime: sectionStartTime,
        endTime: sectionEndTime,
      },
    ]);
    // const selectLabeling = selectedSection.find((section) => section.id === id);
    // if (!selectLabeling) {
    //   const newSelectedSection = [...selectedSection, { id, startTime: sectionStartTime, endTime: sectionEndTime }];
    //   setSelectedSection(newSelectedSection);
    //   setCurrentSection(null);
    // }

    setShowText(true);
  };

  const handleDismiss = () => {
    setShowText(false);
  };

  const ref = useRef(null);

  const handleClickOutside = () => {
    handleDismiss();
  };

  const handleDivClickOutside = () => {
    if (isInputOpenId === id) {
      if (workerType !== 'V' && spanRef.current) {
        handleAddLabelingSentence(spanRef.current.innerText, id, type);
      }
      setIsInputOpenId('');
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  useOnClickOutside(divRef, handleDivClickOutside);

  // 삭제 이벤트
  const handleRemoveSection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, deleteId: string) => {
    e.stopPropagation();
    let newLabelingList: ILabelingAll[] = [];
    if (step === 1) {
      newLabelingList = labelingList.filter((labeling) => labeling.verbal_id !== deleteId);
    } else if (step === 2) {
      newLabelingList = labelingList.filter((labeling) => labeling.paraverbal_id !== deleteId);
    } else if (step === 3) {
      newLabelingList = labelingList.filter((labeling) => labeling.nonverbal_id !== deleteId);
    }
    setSectionData((prev) => prev.filter((item) => item.startTime !== sectionStartTime && item.endTime !== sectionEndTime));
    const newSelectedSection = selectedSection.filter((section) => section.id !== deleteId);
    setSelectedSection(newSelectedSection);
    setCurrentSection(null);
    setLabelingList(newLabelingList);
  };

  // 클릭이벤트
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // if (disableDragging) {
    //   return;
    // }
    if (!isDrag) {
      setSeekingTime(sectionStartTime);
      if ((e.ctrlKey || e.metaKey) && type !== 'step') {
        const findSelectedSection = selectedSection.find((section) => section.id === id);
        if (!findSelectedSection) {
          const newSelectedSection = [
            ...selectedSection,
            {
              id,
              startTime: sectionStartTime,
              endTime: sectionEndTime,
            },
          ];
          if (!selectedSection.length && currentSection && currentSection.id) {
            newSelectedSection.push({
              id: currentSection.id,
              startTime: currentSection.startTime,
              endTime: currentSection.endTime,
            });
          } else {
            if (!selectedSection.length) {
              setCurrentSection({
                id,
                startTime: sectionStartTime,
                endTime: sectionEndTime,
              });
              return;
            }
          }
          setSelectedSection(newSelectedSection);
        } else {
          const newSelectedSection = selectedSection.filter((section) => section.id !== id);
          setSelectedSection(newSelectedSection);
        }
        setCurrentSection(null);
      } else {
        setCurrentSection({
          id,
          startTime: sectionStartTime,
          endTime: sectionEndTime,
        });
        setSelectedSection([]);
      }

      // const selectLabeling = selectedSection.find((section) => section.id === id);
      // if (selectLabeling) {
      //   const newSelectedSection = [...selectedSection, { id, startTime: sectionStartTime, endTime: sectionEndTime }];
      //   setSelectedSection(newSelectedSection);
      // }
    }
    // setIsInputOpenId('');
    if (isReplay && isPlaying) {
      setIsPlaying(false);
    }
    setIsDrag(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLabelingSentence((e.target as HTMLSpanElement).innerText, verbalId, type);
      setIsInputOpenId('');
    }
    if (e.key === 'Escape') {
      setTimeout(() => {
        if (spanRef.current) {
          spanRef.current.innerText = sentence || '';
        }
        setIsInputOpenId('');
        setIsVerbalSentence(sentence || '');
      }, 0);
    }
  };

  // input blur
  const onBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    handleAddLabelingSentence((e.target as HTMLSpanElement).innerText, verbalId, type);
    setIsInputOpenId('');
  };

  const onBlur2 = () => {
    setIsInputOpenId('');
  };

  const handleContentDoubleClick = () => {
    if ((step === 2 || step === 3) && type !== 'step') {
      return;
    }
    if (disableDragging) {
      return;
    }
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    setIsInputOpenId(verbalId);
    setSelectedSection([]);
    setCurrentSection({
      id,
      startTime: sectionStartTime,
      endTime: sectionEndTime,
    });
  };

  const handleDividerDoubleClick = () => {
    if ((step === 2 || step === 3) && type !== 'step') {
      return;
    }
    if (disableDragging) {
      return;
    }
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    if (sentence) {
      return;
    }
    setIsInputOpenId(verbalId);
    setSelectedSection([]);
    setCurrentSection({
      id,
      startTime: sectionStartTime,
      endTime: sectionEndTime,
    });
  };

  if (Number.isNaN(pxPerSec)) return null;

  return (
    <ResizableWrapper ref={divRef}>
      <Rnd
        position={{
          x: sectionStartTime * pxPerSec,
          y: 0,
        }}
        size={{
          width: (sectionEndTime - sectionStartTime) * pxPerSec,
          height: 32,
        }}
        className={classNames('', {
          'section-label': !disableDragging && selectedSection.filter((section) => section.id !== 'new').some((section) => section.id === id),
        })}
        dragAxis="x"
        enableResizing={{
          left: !disableDragging,
          right: !disableDragging,
        }}
        disableDragging={disableDragging}
        onResize={onSectionResize}
        onDrag={onSectionDrag}
        onDragStop={onSelectionDragEnd}
        onResizeStop={onResizeEnd}
      >
        <ResizableSectionWrapper onClick={handleContentClick} onContextMenu={handleContextMenu} onBlur={onBlur2} onDoubleClick={handleDividerDoubleClick}>
          <div className="divider-box">
            <div />
            <Divider orientation="horizontal" width="100%" color="#aaaeb2" mt="20px" />
          </div>
          {showText && (
            <div className="remove-box" onClick={(e) => handleRemoveSection(e, id)} ref={ref}>
              <span>Remove Section</span>
              <Delete width="20" height="20" color={theme.workerColor.white} />
            </div>
          )}
        </ResizableSectionWrapper>
      </Rnd>
      {isInputOpenId === verbalId ? (
        <div
          className="input-wrapper"
          style={{
            transform: `translate(${sectionStartTime * pxPerSec}px, 0px)`,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          ref={divRef}
        >
          <span
            id={`input-${verbalId}`}
            role="textbox"
            contentEditable={workerType !== 'V'}
            className="input-outline"
            onKeyDown={(e) => handleKeyDown(e)}
            onBlur={onBlur}
            ref={spanRef}
            suppressContentEditableWarning
            style={{
              outline: 'none',
            }}
          >
            {isVerbalSentence}
          </span>
        </div>
      ) : (
        <div
          className="sentence-box"
          style={{
            transform: `translate(${sectionStartTime * pxPerSec}px, 0px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: (sectionEndTime - sectionStartTime) * pxPerSec,
            padding: '0px 10px',
          }}
          onClick={handleContentClick}
          onDoubleClick={handleContentDoubleClick}
        >
          <span className="sentence">{sentence}</span>
        </div>
      )}
      {/* <div className="divider-box">
        <div>
          {isInputOpenId !== verbalId ? (
            <div className="input-wrapper">
              <span
                role="textbox"
                contentEditable
                className="input-outline"
                onKeyDown={(e) => handleKeyDown(e)}
                onBlur={onBlur}
                ref={spanRef}
                suppressContentEditableWarning
                // onInput={handleSentenceChange}
              >
                {sentence}
              </span>
            </div>
          ) : (
            <span className="sentence">{sentence}</span>
          )}
        </div>
        <Divider orientation="horizontal" width="100%" color="#aaaeb2" />
      </div> */}
    </ResizableWrapper>
  );
};

export default ResizableSection;
