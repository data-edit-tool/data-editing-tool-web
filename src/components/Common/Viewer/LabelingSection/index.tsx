/* eslint-disable indent */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import { sectionAutoSelectBlockAtom } from 'state/section-auto-select-block.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { timeAtom } from 'state/time.atom';
import { viewerVerbalListSelector } from 'state/viewer-labeling';
import { viewerLoadingSelector } from 'state/viewer-loading';
import { viewerModalAtom } from 'state/viewer-modal';
import { styled } from 'styled-components';
import { ILabelingAll } from 'types/worker-interface';

import WorkerVerbalVAD from 'components/Modal/WorkerVerbalVAD';

import VerbalLabelingHeader from '../../Worker/VerbalLabelingHeader';
import ViewerVerbalLabelingItem from '../VerbalLabelingItem';

const LabelingSectionWrapper = styled.div`
  background-color: #141519;
  width: 933px;
  .filter {
    width: 933px;
    height: 28px;
    background-color: #2a354a;
    padding: 4px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > select {
      width: 128px;
      padding: 3px 12px;
      background: transparent;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path data-name='사각형 2259' style='fill:none' d='M0 0h24v24H0z'/><path data-name='패스 3032' d='M11.969 192h8.662a.694.694 0 0 1 .475 1.181l-4.329 4.457a.661.661 0 0 1-.953 0l-4.329-4.457a.694.694 0 0 1 .474-1.181z' transform='translate(-4.295 -183)' style='fill:darkgrey'/></svg>");
      background-repeat: no-repeat;
      background-position-x: 100%;
      background-position-y: 50%;
      border: 0px;
      color: ${({ theme }) => theme.workerColor.txt2};
      outline: 0;
      font-size: 13px;
      -webkit-appearance: none;
      -moz-appearance: none;
      font-weight: 500;
    }
  }
  .verbal_container {
    width: 933px;
    overflow-x: auto;
    overflow-y: auto;
    &::-webkit-scrollbar {
      background-color: #373d48;
      width: 12px;
      height: 12px;
    }

    &::-webkit-scrollbar-track {
      background-color: #373d48;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.workerColor.line2};
      border-radius: 16px;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }
  }
  ul {
    &.verbal {
      width: 1166px;
      li {
        & > div {
          &:nth-of-type(1) {
            width: 28px;
            justify-content: center;
          }
          &:nth-of-type(2) {
            width: 39px;
            padding-left: 10px;
          }
          &:nth-of-type(3) {
            width: 169px;
            padding-left: 20px;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 14px;
            align-items: center;
          }
          &:nth-of-type(4),
          &:nth-of-type(5),
          &:nth-of-type(6),
          &:nth-of-type(7),
          &:nth-of-type(8),
          &:nth-of-type(9) {
            width: 90px;
            justify-content: center;
          }
          &:nth-of-type(10),
          &:nth-of-type(11) {
            width: 80px;
            justify-content: center;
            button {
              width: 67px;
            }
          }
          &:nth-of-type(12),
          &:nth-of-type(13) {
            width: 107px;
            justify-content: center;
          }
        }
        & > span {
          &:nth-of-type(3) {
            width: 169px;
            padding-left: 20px;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 14px;
          }
        }
      }
    }
    &.header {
      background-color: ${({ theme }) => theme.workerColor.line1};
    }
    &.body {
      height: 255px;
      overflow-y: auto;
      border-bottom: 1px solid ${({ theme }) => theme.workerColor.line2};
      &::-webkit-scrollbar {
        background-color: #373d48;
        width: 12px;
        height: 12px;
      }

      &::-webkit-scrollbar-track {
        background-color: #373d48;
      }

      &::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.workerColor.line2};
        border-radius: 16px;
      }

      &::-webkit-scrollbar-button {
        display: none;
      }
      li {
        border-bottom: 1px solid ${({ theme }) => theme.workerColor.boxBorder};
        &:last-child {
          border-bottom: 0;
        }
      }
    }
    font-size: ${({ theme }) => theme.fontSize.text_12};
    color: ${({ theme }) => theme.workerColor.txt2};
    li {
      display: flex;
      min-height: 28px;
      & > div,
      & > span {
        display: flex;
        align-items: center;
      }
    }
  }
  .footer {
    width: 933px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0px 20px;
    &.justify-end {
      justify-content: flex-end;
    }
    & > div {
      display: flex;
      align-items: center;
      svg {
        cursor: pointer;
      }
      .all-delete {
        display: flex;
        align-items: center;
        margin-right: 16px;
        span {
          margin-right: 4px;
          font-size: ${({ theme }) => theme.fontSize.text_12};
          color: ${({ theme }) => theme.workerColor.txt2};
        }
      }
      .each-delete {
        display: flex;
        align-items: center;
        span {
          margin-right: 4px;
          font-size: ${({ theme }) => theme.fontSize.text_12};
          color: ${({ theme }) => theme.workerColor.txt2};
        }
      }
      .total-count {
        font-size: ${({ theme }) => theme.fontSize.text_12};
        color: ${({ theme }) => theme.workerColor.line2};
        margin-right: 10px;
      }
      .error-label {
        font-size: ${({ theme }) => theme.fontSize.text_12};
        color: ${({ theme }) => theme.workerColor.point};
        font-weight: 500;
        margin-right: 22px;
      }
    }
  }
  .vad-modal {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 7000;
  }
  .edit_option {
    position: absolute;
    top: 8px;
    left: 0;
    background-color: ${({ theme }) => theme.workerColor.primary};
    border-radius: 4px;
    z-index: 5;
    ul {
      li {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3px 8px;
        height: 24px;
        border-bottom: 0;
        span {
          font-size: ${({ theme }) => theme.fontSize.text_12};
          color: ${({ theme }) => theme.workerColor.white};
        }
      }
    }
  }
`;

const ViewerLabelingSection = () => {
  const [isVerbalModal, setIsVerbalModal] = useRecoilState(viewerModalAtom);
  const labelingList = useRecoilValue(viewerVerbalListSelector);
  const time = useRecoilValue(timeAtom);
  const setTimeState = useSetRecoilState(timeAtom);
  const parentContainerRef = useRef<HTMLUListElement | null>(null);
  const [selectedSection, setSelectedSection] = useRecoilState(selectedSectionAtom);
  const setSeekingTime = useSetRecoilState(seekingTimeAtom);
  const loading = useRecoilValue(viewerLoadingSelector);
  const [selectCurrentSection, setCurrentSection] = useRecoilState(currentSectionAtom);
  const [autoSelectBlocked, setAutoSelectBlocked] = useRecoilState(sectionAutoSelectBlockAtom);

  const DEFAULT_ROW_HEIGHT = 28; // matches CSS
  const OVERSCAN_ROWS = 8;
  const OVERSCAN_PX = OVERSCAN_ROWS * DEFAULT_ROW_HEIGHT;
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const filteredListRef = useRef<ILabelingAll[]>([]);
  const lastScrollKeyRef = useRef<string | null>(null);
  const rowHeightsRef = useRef<Record<string, number>>({});
  const heightPrefixRef = useRef<number[]>([0]);

  const getHeightForIndex = useCallback(
    (index: number) => {
      const item = filteredListRef.current[index];
      if (!item) {
        return DEFAULT_ROW_HEIGHT;
      }
      return Math.max(rowHeightsRef.current[item.verbal_id] ?? DEFAULT_ROW_HEIGHT, DEFAULT_ROW_HEIGHT);
    },
    [DEFAULT_ROW_HEIGHT],
  );

  const recomputeHeightPrefix = useCallback(() => {
    const list = filteredListRef.current;
    const prefix: number[] = [0];
    for (let i = 0; i < list.length; i += 1) {
      const nextHeight = getHeightForIndex(i);
      prefix.push(prefix[i] + nextHeight);
    }
    heightPrefixRef.current = prefix;
  }, [getHeightForIndex]);

  const findIndexForOffset = useCallback((offset: number) => {
    const listLength = filteredListRef.current.length;
    const prefix = heightPrefixRef.current;

    if (!listLength) {
      return 0;
    }

    let low = 0;
    let high = listLength - 1;
    let answer = listLength - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const start = prefix[mid];
      const end = prefix[mid + 1];

      if (offset >= end) {
        low = mid + 1;
      } else if (offset < start) {
        answer = mid;
        high = mid - 1;
      } else {
        answer = mid;
        break;
      }
    }

    return answer;
  }, []);

  const recalcVisibleRange = useCallback(() => {
    const el = parentContainerRef.current;
    const listLength = filteredListRef.current.length;
    const prefix = heightPrefixRef.current;

    if (!el || !prefix.length || !listLength) {
      setVisibleRange({ start: 0, end: 0 });
      return;
    }

    const totalHeight = prefix[prefix.length - 1] || 0;
    const viewportHeight = el.clientHeight || 255;
    const maxTop = Math.max(0, totalHeight - viewportHeight);
    const scrollTop = Math.min(el.scrollTop, maxTop);

    if (scrollTop !== el.scrollTop) {
      el.scrollTop = scrollTop;
    }

    const safeTop = Math.max(0, scrollTop - OVERSCAN_PX);
    const safeBottom = Math.min(totalHeight, scrollTop + viewportHeight + OVERSCAN_PX);

    const start = findIndexForOffset(safeTop);
    let end = start;

    while (end < listLength && prefix[end + 1] < safeBottom) {
      end += 1;
    }

    if (end < listLength) {
      end += 1;
    }

    setVisibleRange((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, [OVERSCAN_PX, findIndexForOffset]);

  useEffect(() => {
    if (!loading) {
      parentContainerRef.current?.scrollTo(0, 0);
    }
  }, [loading]);

  useEffect(() => {
    filteredListRef.current = labelingList;
    recomputeHeightPrefix();
    recalcVisibleRange();
  }, [labelingList, recalcVisibleRange, recomputeHeightPrefix]);

  const getLabelingIdForStep = useCallback((labeling: ILabelingAll) => {
    return labeling.verbal_id || '';
  }, []);

  const findIndexBySectionId = useCallback((sectionId: string) => {
    if (!sectionId) {
      return -1;
    }
    const list = filteredListRef.current;
    if (!list.length) {
      return -1;
    }
    return list.findIndex((labeling) => labeling.verbal_id === sectionId);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const el = parentContainerRef.current;
      const list = filteredListRef.current;
      if (!el || !list.length) {
        return false;
      }

      const targetIndex = findIndexBySectionId(sectionId);
      if (targetIndex < 0) {
        return false;
      }

      const height = el.clientHeight || 255;
      const prefix = heightPrefixRef.current;
      const totalHeight = prefix[prefix.length - 1] || 0;
      const itemTop = prefix[targetIndex] || 0;
      const itemBottom = prefix[targetIndex + 1] ?? itemTop + DEFAULT_ROW_HEIGHT;
      const itemHeight = itemBottom - itemTop;
      const maxTop = Math.max(0, totalHeight - height);
      const preferredTop = itemTop - Math.max(0, (height - itemHeight) / 2);
      const nextTop = Math.min(Math.max(preferredTop, 0), maxTop);

      el.scrollTo({
        top: nextTop,
        behavior: 'smooth',
      });

      requestAnimationFrame(() => {
        recalcVisibleRange();
      });

      return true;
    },
    [DEFAULT_ROW_HEIGHT, findIndexBySectionId, recalcVisibleRange],
  );

  const handleRowHeightChange = useCallback(
    (labelingId: string, height: number) => {
      const nextHeight = Math.max(height, DEFAULT_ROW_HEIGHT);
      if (rowHeightsRef.current[labelingId] === nextHeight) {
        return;
      }
      rowHeightsRef.current[labelingId] = nextHeight;
      recomputeHeightPrefix();
      recalcVisibleRange();
    },
    [DEFAULT_ROW_HEIGHT, recalcVisibleRange, recomputeHeightPrefix],
  );

  useEffect(() => {
    if (autoSelectBlocked) {
      if (!selectCurrentSection && selectedSection.length === 0) {
        lastScrollKeyRef.current = null;
        return;
      }
      setAutoSelectBlocked(false);
    }

    // 사용자 드래그로 만든 임시 구간(`id === ''`)이 활성화되어 있을 땐
    // 자동 포커싱 로직이 개입하지 않도록 즉시 반환한다.
    if (selectCurrentSection && selectCurrentSection.id === '') {
      lastScrollKeyRef.current = null;
      return;
    }

    let targetId: string | null = selectCurrentSection?.id ?? null;

    if (!targetId && selectedSection.length) {
      for (let i = selectedSection.length - 1; i >= 0; i -= 1) {
        const candidateId = selectedSection[i].id;
        if (findIndexBySectionId(candidateId) !== -1) {
          targetId = candidateId;
          break;
        }
      }
    }

    if (!targetId) {
      const list = labelingList;
      for (let i = 0; i < list.length; i += 1) {
        const labeling = list[i];
        if (!labeling.active && !labeling.selected) {
          continue;
        }
        const candidateId = getLabelingIdForStep(labeling);
        if (candidateId && findIndexBySectionId(candidateId) !== -1) {
          targetId = candidateId;
          break;
        }
      }
    }

    if (!targetId) {
      lastScrollKeyRef.current = null;
      return;
    }

    const scrollKey = `1-${targetId}`;
    if (lastScrollKeyRef.current === scrollKey) {
      return;
    }

    const shouldAutoSelect = selectedSection.length === 0 && (!selectCurrentSection || selectCurrentSection.id !== targetId);
    const targetIndex = findIndexBySectionId(targetId);
    const targetLabeling = targetIndex >= 0 ? filteredListRef.current[targetIndex] : undefined;

    if (shouldAutoSelect && targetLabeling) {
      const section = {
        id: targetId,
        startTime: targetLabeling.start_time / 1000,
        endTime: targetLabeling.end_time / 1000,
      };
      if (!selectCurrentSection || selectCurrentSection.id !== section.id) {
        setCurrentSection(section);
      }

      const startMs = targetLabeling.start_time;
      const endMs = targetLabeling.end_time;
      if (time < startMs || time > endMs) {
        const seekSec = Math.min(Math.max(startMs / 1000, 0), endMs / 1000);
        requestAnimationFrame(() => {
          setSeekingTime(seekSec);
          setTimeState(startMs);
        });
      }
    }

    const didScroll = scrollToSection(targetId);
    if (didScroll) {
      lastScrollKeyRef.current = scrollKey;
    }
  }, [
    autoSelectBlocked,
    labelingList,
    getLabelingIdForStep,
    selectCurrentSection,
    selectedSection,
    setCurrentSection,
    setSeekingTime,
    setTimeState,
    time,
    findIndexBySectionId,
    scrollToSection,
    setAutoSelectBlocked,
  ]);

  // Update visible window on scroll
  useEffect(() => {
    const el = parentContainerRef.current;
    if (!el) return;
    let rafId = 0 as number;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(recalcVisibleRange);
    };
    recalcVisibleRange();
    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [recalcVisibleRange]);

  useEffect(() => {
    setIsVerbalModal({
      open: false,
      top: 0,
      right: 130,
      type: 'verbal_vad',
      verbalId: '',
      title: '',
      data: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // verbal vad, overall vad 모달 오픈
  const handleVerbalModalOpen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: 'verbal_vad' | 'overall_vad',
    verbalId: string,
    title: string,
    data: {
      valence: number;
      arousal: number;
      dominance: number;
    } | null,
  ) => {
    e.stopPropagation();
    const findVerbal = labelingList.find((labeling) => labeling.verbal_id === verbalId);
    if (findVerbal) {
      const findSelectedSection = selectedSection.find((section) => section.id === verbalId);
      if (!selectedSection.length || !findSelectedSection) {
        setSelectedSection([
          {
            id: verbalId,
            startTime: findVerbal.start_time,
            endTime: findVerbal.end_time,
          },
        ]);
      }
    }
    setIsVerbalModal({
      open: true,
      top: e.clientY + 15,
      right: type === 'verbal_vad' ? 130 : 80,
      type,
      verbalId,
      title,
      data,
    });
  };

  const handleVerbalVadCancel = () => {
    setIsVerbalModal({
      open: false,
      top: 0,
      right: 130,
      type: 'verbal_vad',
      verbalId: '',
      title: '',
      data: null,
    });
  };

  // cell 클릭시 오디오 라벨링 영역 및 오디오 구간 선택
  const handleCellSelect = (ctrlStatus: boolean, verbalId: string, startTime: number, endTime: number) => {
    setSeekingTime(startTime / 1000);
    if (ctrlStatus) {
      const findSelectedSection = selectedSection.find((section) => section.id === verbalId);
      if (!findSelectedSection) {
        const newSelectedSection = [
          ...selectedSection,
          {
            id: verbalId,
            startTime: startTime / 1000,
            endTime: endTime / 1000,
          },
        ];
        if (!selectedSection.length && selectCurrentSection && selectCurrentSection.id) {
          newSelectedSection.push({
            id: selectCurrentSection.id,
            startTime: selectCurrentSection.startTime,
            endTime: selectCurrentSection.endTime,
          });
        } else {
          if (!selectedSection.length) {
            setCurrentSection({
              id: verbalId,
              startTime: startTime / 1000,
              endTime: endTime / 1000,
            });
            return;
          }
        }
        setSelectedSection(newSelectedSection);
      } else {
        const newSelectedSection = selectedSection.filter((section) => section.id !== verbalId);
        setSelectedSection(newSelectedSection);
      }
      setCurrentSection(null);
    } else {
      setSelectedSection([]);
      setCurrentSection({
        id: verbalId,
        startTime: startTime / 1000,
        endTime: endTime / 1000,
      });
    }
  };

  return (
    <LabelingSectionWrapper>
      <div className="filter">
        <span />
      </div>
      <div className="verbal_container">
        <ul className={classNames('header', 'verbal')}>
          <VerbalLabelingHeader />
        </ul>
        <ul className={classNames('body', 'verbal')} ref={parentContainerRef}>
          {(() => {
            const { start, end } = visibleRange;
            const prefix = heightPrefixRef.current;
            const totalHeight = prefix[prefix.length - 1] || 0;
            const topPad = prefix[start] || 0;
            const bottomPad = totalHeight - (prefix[end] || totalHeight);
            return (
              <>
                {topPad > 0 && <li style={{ height: `${topPad}px` }} />}
                {labelingList.slice(start, end).map((labeling, idx) => (
                  <ViewerVerbalLabelingItem
                    key={labeling.verbal_id || `verbal-${start + idx}`}
                    index={start + idx}
                    labeling={labeling}
                    onModalClick={handleVerbalModalOpen}
                    onClick={handleCellSelect}
                    active={
                      selectedSection.some((selectSection) => selectSection.id === labeling.verbal_id)
                        ? 'active'
                        : selectCurrentSection && selectCurrentSection.id === labeling.verbal_id
                        ? 'active'
                        : ''
                    }
                    process={labeling.start_time <= Math.round(time) && labeling.end_time >= time}
                    onScroll={(top: number) => {
                      parentContainerRef.current?.scrollTo({
                        top,
                        behavior: 'smooth',
                      });
                    }}
                    error={''}
                    workerType="V"
                    viewerType={true}
                    onHeightChange={handleRowHeightChange}
                  />
                ))}
                {bottomPad > 0 && <li style={{ height: `${bottomPad}px` }} />}
              </>
            );
          })()}
        </ul>
      </div>
      <div className={classNames('footer', 'justify-end')}>
        <div>
          <span className="total-count">{labelingList.length}개</span>
        </div>
      </div>
      {isVerbalModal.open && (
        <div className="vad-modal" style={{ top: isVerbalModal.top, right: isVerbalModal.right }}>
          <WorkerVerbalVAD
            onConfirm={() => {
              return;
            }}
            onCancel={handleVerbalVadCancel}
            type={isVerbalModal.type}
            title={isVerbalModal.title}
            data={isVerbalModal.data}
            verbalId={isVerbalModal.verbalId}
            viewerType={true}
          />
        </div>
      )}
    </LabelingSectionWrapper>
  );
};

export default ViewerLabelingSection;
