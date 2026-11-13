/* eslint-disable indent */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import { sectionAutoSelectBlockAtom } from 'state/section-auto-select-block.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { timeAtom } from 'state/time.atom';
import { delayAtom } from 'state/worker-delay';
import {
  workerLabelingErrorCheckListSelector,
  workerLabelingListSelector,
  workerLabelingMetaSelector,
  workerLabelingSelectEditLabelingSelector,
  workerLabelingSpeakersSelector,
  workerLabelingVerbalResizeListSelector,
  workerLabelingViewerStepSelector,
  workerOriginalLabelingListSelector,
} from 'state/worker-labeling';
import { workerLabelingHistoryIndexSelector, workerLabelingHistoryListSelector } from 'state/worker-labeling-history-list';
import { workerLoadingSelector } from 'state/worker-loading';
import { workerModalAtom } from 'state/worker-modal';
import { workerTypeSelector } from 'state/worker-project';
import { workerSpeakerSelector } from 'state/worker-speaker';
import { workerTempLabelingListSelector } from 'state/worker-temp-labeling';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { ILabelingAll } from 'types/worker-interface';

import ModalContainer from 'components/Modal';
import Alert from 'components/Modal/WorkerAlert';
import WorkerVerbalVAD from 'components/Modal/WorkerVerbalVAD';
import AllDelete from 'components/SVG/Icon/AllDelete';
import Delete from 'components/SVG/Icon/Delete';

import NonVerbalLabelingHeader from '../NonVerbalLabelingHeader';
import NonVerbalLabelingItem from '../NonVerbalLabelingItem';
import ParaverbalLabelingHeader from '../ParaverbalLabelingHeader';
import ParaverbalLabelingItem from '../ParaverbalLabelingItem';
import VerbalLabelingHeader from '../VerbalLabelingHeader';
import VerbalLabelingItem from '../VerbalLabelingItem';

const LabelingSectionWrapper = styled.div`
  background-color: #141519;
  width: 933px;
  .filter {
    width: 933px;
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
            & > span {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              word-break: break-all;
            }
            & > .sentence-input {
              width: 100%;
            }
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
      }
    }
    &.paraverbal {
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
            width: 655px;
            padding-left: 20px;
          }
          &:nth-of-type(4),
          &:nth-of-type(5) {
            width: 107px;
            justify-content: center;
          }
        }
      }
    }
    &.non-verbal {
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
            width: 82px;
            justify-content: center;
          }
          &:nth-of-type(4) {
            width: 139px;
            justify-content: center;
          }
          &:nth-of-type(5),
          &:nth-of-type(6),
          &:nth-of-type(7),
          &:nth-of-type(8),
          &:nth-of-type(9),
          &:nth-of-type(10) {
            width: 82px;
            justify-content: center;
          }
          &:nth-of-type(11),
          &:nth-of-type(12) {
            width: 78px;
            justify-content: center;
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
      height: 28px;
      & > div {
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

const LabelingSection = () => {
  const [isVerbalModal, setIsVerbalModal] = useRecoilState(workerModalAtom);
  const [isAlert, setIsAlert] = useState<{
    open: boolean;
    title: string;
    content: string;
    rightBtnText: string;
    type: string;
    isCancel: boolean;
    color?: string;
  }>({
    open: false,
    title: '',
    content: '',
    rightBtnText: '',
    type: '',
    isCancel: true,
    color: '',
  });
  const projectMeta = useRecoilValue(workerLabelingMetaSelector);
  const [labelingList, setLabelingList] = useRecoilState(workerLabelingListSelector);
  const [originalLabelingList, setOriginalLabelingList] = useRecoilState(workerOriginalLabelingListSelector);
  const time = useRecoilValue(timeAtom);
  const setTimeState = useSetRecoilState(timeAtom);
  const parentContainerRef = useRef<HTMLUListElement | null>(null);
  const [errorLabelingList, setErrorLabelingList] = useRecoilState(workerLabelingErrorCheckListSelector);
  const speakerList = useRecoilValue(workerLabelingSpeakersSelector);
  const [selectedSection, setSelectedSection] = useRecoilState(selectedSectionAtom);
  const workerType = useRecoilValue(workerTypeSelector);
  const [selectSpeaker, setSelectSpeaker] = useRecoilState(workerSpeakerSelector);
  const setSeekingTime = useSetRecoilState(seekingTimeAtom);
  const [selectEditRowLabelingId, setSelectEditRowLabelingId] = useState<string>('');
  const setEditLabelingId = useSetRecoilState(workerLabelingSelectEditLabelingSelector);
  const [deleteLabelingId, setDeleteLabelingId] = useState('');
  const [step, setStep] = useState<number | null>(null);
  const labelHistoryIndex = useRecoilValue(workerLabelingHistoryIndexSelector);
  const [labelHistoryList, setLabelHistoryList] = useRecoilState(workerLabelingHistoryListSelector);
  const viewerStep = useRecoilValue(workerLabelingViewerStepSelector);
  const setTempLabelingList = useSetRecoilState(workerTempLabelingListSelector);
  const loading = useRecoilValue(workerLoadingSelector);
  const delay = useRecoilValue(delayAtom);
  const [selectCurrentSection, setCurrentSection] = useRecoilState(currentSectionAtom);
  const [autoSelectBlocked, setAutoSelectBlocked] = useRecoilState(sectionAutoSelectBlockAtom);
  const verbalLabelingList = useRecoilValue(workerLabelingVerbalResizeListSelector);

  // Simple row-virtualization for all steps (verbal, paraverbal, non-verbal)
  const ROW_HEIGHT = 28; // matches CSS
  const OVERSCAN_ROWS = 8;
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const filteredListRef = useRef<ILabelingAll[]>([]);
  const lastScrollKeyRef = useRef<string | null>(null);
  const recalcVisibleRange = useCallback(() => {
    const el = parentContainerRef.current;
    if (!el) {
      return;
    }

    const total = filteredListRef.current.length;
    const height = el.clientHeight || 255;
    const maxScrollTop = Math.max(0, total * ROW_HEIGHT - height);
    const clampedTop = Math.min(el.scrollTop, maxScrollTop);

    if (clampedTop !== el.scrollTop) {
      el.scrollTop = clampedTop;
    }

    const count = Math.ceil(height / ROW_HEIGHT) + OVERSCAN_ROWS * 2;
    const maxStart = Math.max(0, total - count);
    const approxStart = Math.floor(clampedTop / ROW_HEIGHT) - OVERSCAN_ROWS;
    const start = Math.min(Math.max(0, approxStart), maxStart);
    const end = Math.min(total, start + count);

    setVisibleRange((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, [OVERSCAN_ROWS, ROW_HEIGHT]);

  useEffect(() => {
    if (!loading) {
      parentContainerRef.current?.scrollTo(0, 0);
    }
  }, [loading]);

  // Compute filtered labeling list by selected speakers (used for all steps)
  const filteredList = React.useMemo(() => {
    return labelingList.filter((labeling) => {
      if (selectSpeaker.length === speakerList.length) {
        return true; // 모든 스피커가 선택된 경우 모든 데이터 표시
      }
      if (selectSpeaker.length) {
        return selectSpeaker.includes(labeling.speaker_id);
      }
      return true;
    });
  }, [labelingList, selectSpeaker, speakerList.length]);

  useEffect(() => {
    filteredListRef.current = filteredList;
    recalcVisibleRange();
  }, [filteredList, recalcVisibleRange, step]);

  const getLabelingIdForStep = useCallback((labeling: ILabelingAll, currentStep: number) => {
    if (currentStep === 2) {
      return labeling.paraverbal_id || '';
    }
    if (currentStep === 3) {
      return labeling.nonverbal_id || '';
    }
    return labeling.verbal_id || '';
  }, []);

  const findIndexBySectionId = useCallback((sectionId: string, currentStep: number) => {
    if (!sectionId) {
      return -1;
    }
    const list = filteredListRef.current;
    if (!list.length) {
      return -1;
    }

    if (currentStep === 2) {
      return list.findIndex((labeling) => labeling.paraverbal_id === sectionId);
    }
    if (currentStep === 3) {
      return list.findIndex((labeling) => labeling.nonverbal_id === sectionId);
    }
    return list.findIndex((labeling) => labeling.verbal_id === sectionId);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string, currentStep: number) => {
      const el = parentContainerRef.current;
      const list = filteredListRef.current;
      if (!el || !list.length) {
        return false;
      }

      const targetIndex = findIndexBySectionId(sectionId, currentStep);
      if (targetIndex < 0) {
        return false;
      }

      const height = el.clientHeight || 255;
      const totalHeight = list.length * ROW_HEIGHT;
      const maxTop = Math.max(0, totalHeight - height);
      const preferredTop = targetIndex * ROW_HEIGHT - Math.max(0, (height - ROW_HEIGHT) / 2);
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
    [ROW_HEIGHT, findIndexBySectionId, recalcVisibleRange],
  );

  useEffect(() => {
    if (autoSelectBlocked) {
      if (!selectCurrentSection && selectedSection.length === 0) {
        lastScrollKeyRef.current = null;
        return;
      }
      setAutoSelectBlocked(false);
    }

    const activeStep = step === null ? 1 : step;

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
        if (findIndexBySectionId(candidateId, activeStep) !== -1) {
          targetId = candidateId;
          break;
        }
      }
    }

    if (!targetId) {
      const list = filteredList;
      for (let i = 0; i < list.length; i += 1) {
        const labeling = list[i];
        if (!labeling.active && !labeling.selected) {
          continue;
        }
        const candidateId = getLabelingIdForStep(labeling, activeStep);
        if (candidateId && findIndexBySectionId(candidateId, activeStep) !== -1) {
          targetId = candidateId;
          break;
        }
      }
    }

    if (!targetId) {
      lastScrollKeyRef.current = null;
      return;
    }

    const scrollKey = `${activeStep}-${targetId}`;
    if (lastScrollKeyRef.current === scrollKey) {
      return;
    }

    const shouldAutoSelect = selectedSection.length === 0 && (!selectCurrentSection || selectCurrentSection.id !== targetId);
    const targetIndex = findIndexBySectionId(targetId, activeStep);
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

    const didScroll = scrollToSection(targetId, activeStep);
    if (didScroll) {
      lastScrollKeyRef.current = scrollKey;
    }
  }, [
    autoSelectBlocked,
    filteredList,
    getLabelingIdForStep,
    selectCurrentSection,
    selectedSection,
    setCurrentSection,
    setSeekingTime,
    setTimeState,
    step,
    time,
    findIndexBySectionId,
    scrollToSection,
    setAutoSelectBlocked,
  ]);

  // Update visible window on scroll for the active step
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
  }, [recalcVisibleRange, step]);

  const handleDeleteAlert = useCallback(() => {
    if (selectCurrentSection) {
      if (step === 2) {
        const findLabeling = labelingList.find((labeling) => labeling.paraverbal_id === selectCurrentSection.id);
        if (!findLabeling) {
          return;
        }
      }
      if (step === 3) {
        const findLabeling = labelingList.find((labeling) => labeling.nonverbal_id === selectCurrentSection.id);
        if (!findLabeling) {
          return;
        }
      }
      setIsAlert({
        open: true,
        title: '삭제',
        content: `선택한 행을 삭제하시겠습니까?`,
        rightBtnText: '확인',
        type: 'eachDelete',
        isCancel: true,
      });
      return;
    }
    if (selectedSection.length) {
      setIsAlert({
        open: true,
        title: '삭제',
        content: `선택한 ${selectedSection.length > 1 ? `${selectedSection.length}행을` : '행을'} 삭제하시겠습니까?`,
        rightBtnText: '확인',
        type: 'eachDelete',
        isCancel: true,
      });
      return;
    }
    // setIsAlert({
    //   open: true,
    //   title: '행 선택 알림',
    //   content: '삭제할 행을 선택하시기 바랍니다.',
    //   rightBtnText: '확인',
    //   type: '',
    //   isCancel: false,
    // });
  }, [labelingList, selectCurrentSection, selectedSection.length, step]);

  // 전체 삭제일 경우 alert
  const handleSTTAllDeleteAlert = useCallback(() => {
    if (
      projectMeta?.work_status === 'RQ' ||
      projectMeta?.work_status === 'CM' ||
      (workerType === 'C' &&
        (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU' || projectMeta?.work_status === 'CM')) ||
      workerType === 'V' ||
      projectMeta?.work_status === 'RJ' ||
      projectMeta?.work_status === null
    ) {
      return;
    }
    setIsAlert({
      open: true,
      title: '전체 삭제',
      content: '전체 행을 삭제하시겠습니까?',
      rightBtnText: '확인',
      type: 'allDelete',
      isCancel: true,
    });
  }, [projectMeta?.work_status, workerType]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (!loading && !(document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SPAN') && workerType !== 'V') {
        // backspace, delete
        if ((e.keyCode === 8 || e.keyCode === 46) && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          handleDeleteAlert();
        } else if ((e.keyCode === 8 || e.keyCode === 46) && !e.ctrlKey && !e.altKey && e.shiftKey && !e.metaKey) {
          handleSTTAllDeleteAlert();
        }
      }
    };
    document.addEventListener('keydown', handleShortcut);

    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, [handleDeleteAlert, handleSTTAllDeleteAlert, loading, workerType]);

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
  }, [loading, projectMeta]);

  useEffect(() => {
    // 작업자 상태에 따른 step 변경
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

  // verbal selectbox 변경
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
    let selectLabelingId = selectedSection.map((section) => section.id);
    if (selectLabelingId.length || selectCurrentSection) {
      if (selectCurrentSection) {
        selectLabelingId = [selectCurrentSection.id];
      }
      const errorFilterId = [] as string[];
      const newLabelingList = labelingList.map((labeling) => {
        if (selectLabelingId.includes(labeling.verbal_id)) {
          const newLabeling = {
            ...labeling,
            [type]: e.target.value,
            active: true,
            selected: true,
          };
          if (type === 'channel' && e.target.value === '64a523400000000000e7688c') {
            newLabeling.bc_intent = '64f18612000000000032316b';
            newLabeling.fc_intent = '';
          }
          if (type === 'channel' && e.target.value === '64a523400000000000e7688d') {
            newLabeling.fc_intent = '64f184960000000000f5d4b3';
            newLabeling.bc_intent = '';
          }
          const { affective_state, channel, sentiment, fc_intent, bc_intent, emotion, verbal_vad, overall_vad } = newLabeling;
          if (affective_state && channel && sentiment && fc_intent && bc_intent && emotion && verbal_vad && overall_vad) {
            errorFilterId.push(labeling.verbal_id);
          }
          return newLabeling;
        }
        return labeling;
      });
      setErrorLabelingList((prev) => prev.filter((errorLabeling) => !errorFilterId.includes(errorLabeling)));

      const newLabelingHistoryList = [...labelHistoryList];

      const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

      setLabelHistoryList([...newLabelingHistorySpliceList, { type: 'edit', data: JSON.stringify(newLabelingList), selectSpeaker }]);

      setLabelingList(newLabelingList);
    }
  };

  // paraverbal selectbox 변경
  const handleSelectChangeParaverbal = (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
    let selectLabelingId = selectedSection.map((section) => section.id);
    if (selectLabelingId.length || selectCurrentSection) {
      if (selectCurrentSection) {
        selectLabelingId = [selectCurrentSection.id];
      }

      const overlapLabeling = [] as string[];

      const newLabelingList = labelingList.map((labeling) => {
        if (selectLabelingId.includes(labeling.paraverbal_id)) {
          const newLabeling = {
            ...labeling,
            [type]: e.target.value,
            active: true,
            selected: true,
          };
          return newLabeling;
        }
        return labeling;
      });

      const filterLabelingList = newLabelingList.filter((labeling) => labeling.func === e.target.value && !selectLabelingId.includes(labeling.paraverbal_id));
      const selectLabelingList = newLabelingList.filter((labeling) => selectLabelingId.includes(labeling.paraverbal_id));

      selectLabelingList.sort((a, b) => a.start_time - b.start_time);

      let previousElement = null as ILabelingAll | null;

      selectLabelingList.forEach((currentElement) => {
        if (previousElement && previousElement.start_time <= currentElement.end_time && previousElement.end_time >= currentElement.start_time) {
          overlapLabeling.push(previousElement.paraverbal_id);
        }
        previousElement = currentElement;
      });

      filterLabelingList.forEach((labeling) => {
        selectLabelingList.forEach((selectLabeling) => {
          // 두 구간이 겹치는지 확인하는 조건
          if (
            selectLabeling.speaker_id === labeling.speaker_id &&
            selectLabeling.start_time <= labeling.end_time &&
            selectLabeling.end_time >= labeling.start_time &&
            !overlapLabeling.includes(labeling.paraverbal_id)
          ) {
            overlapLabeling.push(selectLabeling.paraverbal_id);
          }
        });
      });

      if (overlapLabeling.length) {
        const overlapLabelingIndexList = labelingList
          .filter((labeling) => {
            if (selectSpeaker.length) {
              return selectSpeaker.includes(labeling.speaker_id);
            }
            return labeling;
          })
          .reduce((acc: number[], labeling, index) => {
            if (overlapLabeling.includes(labeling.paraverbal_id)) {
              acc.push(index + 1); // 조건에 맞는 경우에만 index + 1 추가
            }
            return acc;
          }, [])
          .join('행, ');
        setIsAlert({
          open: true,
          title: '중복 구간 알림',
          content: `선택한 구간 '(${overlapLabelingIndexList}행)'이 중복됩니다.`,
          rightBtnText: '확인',
          type: 'alert',
          isCancel: false,
          color: theme.workerColor.point,
        });
        return;
      }
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
      setLabelingList(newLabelingList);
    }
  };

  // nonverbal selectbox 변경
  const handleSelectChangeNonVerbal = (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
    let selectLabelingId = selectedSection.map((section) => section.id);
    if (selectLabelingId.length || selectCurrentSection) {
      if (selectCurrentSection) {
        selectLabelingId = [selectCurrentSection.id];
      }
      const newLabelingList = labelingList.map((labeling) => {
        if (selectLabelingId.includes(labeling.nonverbal_id)) {
          const newLabeling = {
            ...labeling,
            [type]: e.target.value,
            active: true,
            selected: true,
          };
          if (type === 'subject' && newLabeling.subject !== e.target.value) {
            newLabeling.action = '';
            newLabeling.action_str = '';
          }
          if (type === 'action' && !(newLabeling.action === '64c856df000000000075bba4' || newLabeling.action === '64c856df000000000075bbb9')) {
            newLabeling.action_str = '';
          }
          return newLabeling;
        }
        return labeling;
      });
      if (type === 'subject') {
        const filterLabelingList = newLabelingList.filter(
          (labeling) => labeling.subject === e.target.value && !selectLabelingId.includes(labeling.nonverbal_id),
        );
        const selectLabelingList = newLabelingList.filter((labeling) => selectLabelingId.includes(labeling.nonverbal_id));

        selectLabelingList.sort((a, b) => a.start_time - b.start_time);

        const overlapLabeling = [] as string[];

        let previousElement = null as ILabelingAll | null;

        selectLabelingList.forEach((currentElement) => {
          if (previousElement && previousElement.start_time <= currentElement.end_time && previousElement.end_time >= currentElement.start_time) {
            overlapLabeling.push(previousElement.nonverbal_id);
          }
          previousElement = currentElement;
        });

        filterLabelingList.forEach((labeling) => {
          selectLabelingList.forEach((selectLabeling) => {
            // 두 구간이 겹치는지 확인하는 조건
            if (
              selectLabeling.speaker_id === labeling.speaker_id &&
              selectLabeling.start_time <= labeling.end_time &&
              selectLabeling.end_time >= labeling.start_time &&
              !overlapLabeling.includes(labeling.nonverbal_id)
            ) {
              overlapLabeling.push(selectLabeling.nonverbal_id);
            }
          });
        });

        if (overlapLabeling.length) {
          const overlapLabelingIndexList = labelingList
            .filter((labeling) => {
              if (selectSpeaker.length) {
                return selectSpeaker.includes(labeling.speaker_id);
              }
              return labeling;
            })
            .reduce((acc: number[], labeling, index) => {
              if (overlapLabeling.includes(labeling.nonverbal_id)) {
                acc.push(index + 1); // 조건에 맞는 경우에만 index + 1 추가
              }
              return acc;
            }, [])
            .join('행, ');
          setIsAlert({
            open: true,
            title: '중복 구간 알림',
            content: `선택한 구간 '(${overlapLabelingIndexList}행)'이 중복됩니다.`,
            rightBtnText: '확인',
            type: 'alert',
            isCancel: false,
            color: theme.workerColor.point,
          });
          return;
        }
      }

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
      setLabelingList(newLabelingList);
    }
  };

  // verbal input 변경
  const handleInputChange = (value: string, type: string, verbalId: string) => {
    const findLabeling = labelingList.find((labeling) => labeling.verbal_id === verbalId);
    if (findLabeling) {
      const newLabeling = {
        ...findLabeling,
        [type]: value,
      };
      const { affective_state, channel, sentiment, fc_intent, bc_intent, emotion, verbal_vad, overall_vad } = newLabeling;

      if (affective_state && channel && sentiment && fc_intent && bc_intent && emotion && verbal_vad && overall_vad) {
        setErrorLabelingList(
          errorLabelingList.filter((errorLabeling) => {
            let status = true;
            selectedSection.forEach((section) => {
              if (errorLabeling === section.id) {
                status = false;
              }
            });
            return status;
          }),
        );
      }
      const newLabelingList = labelingList.map((labeling) =>
        labeling.verbal_id === verbalId ? { ...newLabeling, active: true } : { ...labeling, active: false },
      );
      const newLabelingHistoryList = [...labelHistoryList];

      const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

      setLabelHistoryList([...newLabelingHistorySpliceList, { type: 'edit', data: JSON.stringify(newLabelingList), selectSpeaker }]);

      setLabelingList(newLabelingList);
    }
  };

  // nonverbal input 변경
  const handleInputChangeNonVerbal = (value: string, type: string, nonVerbalId: string) => {
    const findLabeling = labelingList.find((labeling) => labeling.nonverbal_id === nonVerbalId);
    if (findLabeling) {
      const newLabeling = {
        ...findLabeling,
        [type]: value,
      };
      const { subject, action, action_str, obj, angle, affective_state, intent, func, emotion } = newLabeling;

      if (subject && action && action_str && obj && angle && affective_state && intent && func && emotion) {
        setErrorLabelingList(
          errorLabelingList.filter((errorLabeling) => {
            let status = true;
            selectedSection.forEach((section) => {
              if (errorLabeling === section.id) {
                status = false;
              }
            });
            return status;
          }),
        );
      }
      const newLabelingList = labelingList.map((labeling) =>
        labeling.nonverbal_id === nonVerbalId ? { ...newLabeling, active: true } : { ...labeling, active: false },
      );
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
      setLabelingList(newLabelingList);
    }
  };

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

  // vad 모달에서 확인 누르면 값 세팅
  const handleVerbalVadConfirm = (valence: number, arousal: number, dominance: number, viewerType: boolean) => {
    if (viewerType) {
      setIsVerbalModal({
        open: false,
        top: 0,
        right: 130,
        type: 'verbal_vad',
        verbalId: '',
        title: '',
        data: null,
      });
      return;
    }
    const selectLabelingId = selectedSection.map((section) => section.id);
    if (!selectLabelingId.length) {
      return;
    }
    const { type } = isVerbalModal;
    const errorFilterId = [] as string[];
    const newLabelingList = labelingList.map((labeling) => {
      if (selectLabelingId.includes(labeling.verbal_id)) {
        const newLabeling = {
          ...labeling,
          [type]: {
            valence,
            arousal,
            dominance,
          },
        };
        const { affective_state, channel, sentiment, fc_intent, bc_intent, emotion, verbal_vad, overall_vad } = newLabeling;
        if (affective_state && channel && sentiment && fc_intent && bc_intent && emotion && verbal_vad && overall_vad) {
          errorFilterId.push(labeling.verbal_id);
        }
        return newLabeling;
      }
      return labeling;
    });
    setErrorLabelingList((prev) => prev.filter((errorLabeling) => !errorFilterId.includes(errorLabeling)));
    const newLabelingHistoryList = [...labelHistoryList];

    const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

    setLabelHistoryList([...newLabelingHistorySpliceList, { type: 'edit', data: JSON.stringify(newLabelingList), selectSpeaker }]);

    setLabelingList(newLabelingList);
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
    if (delay) {
      return;
    }
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

  // selectBox 클릭 예외처리
  const handleVerbalSelectClick = (e: React.MouseEvent<HTMLSelectElement>, verbalId: string) => {
    e.stopPropagation();
    setCurrentSection(null);
    const findVerbal = labelingList.find((labeling) => labeling.verbal_id === verbalId);
    if (findVerbal) {
      const findSelectedSection = selectedSection.find((section) => section.id === verbalId);
      if (selectedSection.length && findSelectedSection) {
        setCurrentSection(null);
        setSeekingTime(findVerbal.start_time / 1000);
        return;
      }
      if (!selectedSection.length && !findSelectedSection) {
        setCurrentSection({
          id: verbalId,
          startTime: findVerbal.start_time / 1000,
          endTime: findVerbal.end_time / 1000,
        });
        setSelectedSection([]);
        setSeekingTime(findVerbal.start_time / 1000);
      }
    }
  };

  // selectBox 클릭 예외처리
  const handleParaverbalSelectClick = (e: React.MouseEvent<HTMLSelectElement>, paraverbalId: string) => {
    e.stopPropagation();
    setCurrentSection(null);
    const findParaverbal = labelingList.find((labeling) => labeling.paraverbal_id === paraverbalId);
    if (findParaverbal) {
      const findSelectedSection = selectedSection.find((section) => section.id === paraverbalId);
      if (selectedSection.length && findSelectedSection) {
        setCurrentSection(null);
        setSeekingTime(findParaverbal.start_time / 1000);
        return;
      }
      if (!selectedSection.length && !findSelectedSection) {
        setCurrentSection({
          id: paraverbalId,
          startTime: findParaverbal.start_time / 1000,
          endTime: findParaverbal.end_time / 1000,
        });
        setSelectedSection([]);
        setSeekingTime(findParaverbal.start_time / 1000);
        return;
      }
    }
  };

  // selectBox 클릭 예외처리
  const handleNonVerbalSelectClick = (e: React.MouseEvent<HTMLSelectElement>, nonVerbalId: string) => {
    e.stopPropagation();
    setCurrentSection(null);
    const findNonVerbal = labelingList.find((labeling) => labeling.nonverbal_id === nonVerbalId);
    if (findNonVerbal) {
      const findSelectedSection = selectedSection.find((section) => section.id === nonVerbalId);
      if (selectedSection.length && findSelectedSection) {
        setCurrentSection(null);
        setSeekingTime(findNonVerbal.start_time / 1000);
        return;
      }
      if (!selectedSection.length && !findSelectedSection) {
        setCurrentSection({
          id: nonVerbalId,
          startTime: findNonVerbal.start_time / 1000,
          endTime: findNonVerbal.end_time / 1000,
        });
        setSelectedSection([]);
        setSeekingTime(findNonVerbal.start_time / 1000);
        return;
      }
    }
  };

  // 개별 삭제
  const handleDelete = () => {
    const deleteSection = selectCurrentSection ? [selectCurrentSection] : selectedSection;

    if (deleteSection.length) {
      let newLabelingList: ILabelingAll[] = [];
      // step에 따른 제거
      if (step === 1) {
        newLabelingList = labelingList.filter((labeling) => {
          let status = true;
          deleteSection.forEach((section) => {
            if (labeling.verbal_id === section.id) {
              status = false;
            }
          });
          return status;
        });
      } else if (step === 2) {
        newLabelingList = labelingList.filter((labeling) => {
          let status = true;
          deleteSection.forEach((section) => {
            if (labeling.paraverbal_id === section.id) {
              status = false;
            }
          });
          return status;
        });
      } else if (step === 3) {
        newLabelingList = labelingList.filter((labeling) => {
          let status = true;
          deleteSection.forEach((section) => {
            if (labeling.nonverbal_id === section.id) {
              status = false;
            }
          });
          return status;
        });
      }
      if (!newLabelingList.length) {
        setTempLabelingList(labelingList);
      }
      const newLabelingHistoryList = [...labelHistoryList];

      const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

      setLabelHistoryList([
        ...newLabelingHistorySpliceList,
        { type: 'edit', data: JSON.stringify(newLabelingList.map((labeling) => ({ ...labeling, active: false }))), selectSpeaker },
      ]);
      setLabelingList(newLabelingList);
      setAutoSelectBlocked(true);
      setSelectedSection([]);
      setCurrentSection(null);
    }
  };

  // 왼쪽버튼 클릭 후 remove 클릭시
  const handleEditDelete = () => {
    if (deleteLabelingId) {
      let newLabelingList: ILabelingAll[] = [];
      // step에 따른 삭제
      if (step === 1) {
        newLabelingList = labelingList.filter((labeling) => labeling.verbal_id !== deleteLabelingId);
      } else if (step === 2) {
        newLabelingList = labelingList.filter((labeling) => labeling.paraverbal_id !== deleteLabelingId);
      } else if (step === 3) {
        newLabelingList = labelingList.filter((labeling) => labeling.nonverbal_id !== deleteLabelingId);
      }
      const newLabelingHistoryList = [...labelHistoryList];

      const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

      setTempLabelingList(!newLabelingList.length ? labelingList : []);
      setLabelHistoryList([
        ...newLabelingHistorySpliceList,
        { type: 'edit', data: JSON.stringify(newLabelingList.map((labeling) => ({ ...labeling, active: false }))), selectSpeaker },
      ]);
      setLabelingList(newLabelingList);
      setAutoSelectBlocked(true);
      setSelectedSection([]);
      setCurrentSection(null);
    }
  };

  // paraverbal에서 speaker 변경
  const handleSpeakerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '') {
      setSelectSpeaker([]);
    } else {
      setSelectSpeaker([e.target.value]);
    }
    setSelectedSection([]);
    setCurrentSection(null);
    const newLabelingHistoryList = [...labelHistoryList];

    const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

    setLabelHistoryList([...newLabelingHistorySpliceList, { type: 'edit', data: JSON.stringify(labelingList), selectSpeaker: [e.target.value] }]);
  };

  // 전체삭제
  const handleSTTAllDelete = () => {
    setTempLabelingList(labelingList);
    const newLabelingHistoryList = [...labelHistoryList];
    const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

    setLabelHistoryList([...newLabelingHistorySpliceList, { type: 'edit', data: JSON.stringify([]), selectSpeaker }]);
    setLabelingList([]);
    setAutoSelectBlocked(true);
    setSelectedSection([]);
    setCurrentSection(null);
  };

  const handleCancel = () => {
    setIsAlert({
      open: false,
      title: '',
      content: '',
      rightBtnText: '',
      type: '',
      isCancel: true,
    });
  };

  const handleConfirm = () => {
    const { type } = isAlert;
    // confirm type에 따른 분기처리
    if (type === 'allDelete') {
      handleSTTAllDelete();
    } else if (type === 'eachDelete') {
      handleDelete();
    } else if (type === 'editDelete') {
      handleEditDelete();
    }

    handleCancel();
  };

  // 수정 버튼 클릭시
  const handleEditLabeling = (id: string, reset?: boolean) => {
    if (reset) {
      setEditLabelingId('');
    }
    setSelectEditRowLabelingId(id);
  };

  // 작업자 상태및 작업상태에 따른 삭제
  const handleLabelingDelete = (id: string) => {
    if (
      projectMeta?.work_status === 'RQ' ||
      projectMeta?.work_status === 'CM' ||
      (workerType === 'C' &&
        (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU' || projectMeta?.work_status === 'CM')) ||
      workerType === 'V' ||
      projectMeta?.work_status === 'RJ' ||
      projectMeta?.work_status === null
    ) {
      return;
    }
    setDeleteLabelingId(id);
    setIsAlert({
      open: true,
      title: '삭제',
      content: '선택한 행을 삭제하시겠습니까?',
      rightBtnText: '확인',
      type: 'editDelete',
      isCancel: true,
    });
  };

  // 수정 후 취소버튼 누르면 해당 cell 데이터 원복
  const handleEditCancel = (id: string) => {
    if (step === 1) {
      // originalLabelingList 원본 데이터 저장소
      const originalLabeling = originalLabelingList.find((labeling) => labeling.verbal_id === id);
      if (originalLabeling) {
        setSeekingTime(originalLabeling.start_time / 1000);
        setSelectedSection([]);
        const newLabelingList = labelingList.map((labeling) => {
          if (labeling.verbal_id === id) {
            return originalLabeling;
          }
          return labeling;
        });
        setLabelingList([...newLabelingList]);
        setSelectEditRowLabelingId('');
        setEditLabelingId('');
      }
    } else if (step === 2) {
      const originalLabeling = originalLabelingList.find((labeling) => labeling.paraverbal_id === id);
      if (originalLabeling) {
        setSeekingTime(originalLabeling.start_time / 1000);
        setSelectedSection([]);
        const newLabelingList = labelingList.map((labeling) => {
          if (labeling.paraverbal_id === id) {
            return originalLabeling;
          }
          return labeling;
        });
        setLabelingList([...newLabelingList]);
        setSelectEditRowLabelingId('');
        setEditLabelingId('');
      }
    } else if (step === 3) {
      const originalLabeling = originalLabelingList.find((labeling) => labeling.nonverbal_id === id);
      if (originalLabeling) {
        setSeekingTime(originalLabeling.start_time / 1000);
        setSelectedSection([]);
        const newLabelingList = labelingList.map((labeling) => {
          if (labeling.nonverbal_id === id) {
            return originalLabeling;
          }
          return labeling;
        });
        setLabelingList([...newLabelingList]);
        setSelectEditRowLabelingId('');
        setEditLabelingId('');
      }
    }
  };

  const handleEditSubmit = () => {
    setOriginalLabelingList([...labelingList]);
  };

  return (
    <LabelingSectionWrapper>
      {isAlert.open && (
        <ModalContainer id="modal">
          <Alert
            title={isAlert.title}
            content={isAlert.content}
            rightBtnText={isAlert.rightBtnText}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            isCancel={isAlert.isCancel}
            color={isAlert.color || undefined}
          />
        </ModalContainer>
      )}
      <div className="filter">
        <select
          onChange={handleSpeakerChange}
          value={selectSpeaker.length ? (selectSpeaker.length === speakerList.length ? 'none' : selectSpeaker.length === 1 ? selectSpeaker[0] : 'mix') : ''}
        >
          <option value="">전체</option>
          {speakerList.map((speaker) => (
            <option key={speaker.speaker_id} value={speaker.speaker_id}>
              {speaker.speaker_id}
            </option>
          ))}
          <option hidden value="mix">
            Mix
          </option>
          <option hidden value="none">
            None
          </option>
        </select>
      </div>
      <div
        className={classNames({
          verbal_container: step === null || step === 1,
        })}
      >
        <ul
          className={classNames('header', {
            verbal: step === null || step === 1,
            paraverbal: step === 2,
            'non-verbal': step === 3,
          })}
        >
          {step === null || step === 1 ? <VerbalLabelingHeader /> : null}
          {step === 2 && <ParaverbalLabelingHeader />}
          {step === 3 && <NonVerbalLabelingHeader />}
        </ul>
        <ul
          className={classNames('body', {
            verbal: step === null || step === 1,
            paraverbal: step === 2,
            'non-verbal': step === 3,
          })}
          ref={parentContainerRef}
        >
          {step === null || step === 1
            ? (() => {
                const { start, end } = visibleRange;
                const total = filteredList.length;
                const topPad = start * ROW_HEIGHT;
                const bottomPad = (total - end) * ROW_HEIGHT;
                return (
                  <>
                    {topPad > 0 && <li style={{ height: `${topPad}px` }} />}
                    {filteredList.slice(start, end).map((labeling, idx) => (
                      <VerbalLabelingItem
                        key={labeling.verbal_id || `verbal-${start + idx}`}
                        index={start + idx}
                        labeling={labeling}
                        handleSelectChange={handleSelectChange}
                        handleInputChange={handleInputChange}
                        onModalClick={handleVerbalModalOpen}
                        onClick={handleCellSelect}
                        active={
                          selectedSection.some((selectSection) => selectSection.id === labeling.verbal_id)
                            ? 'active'
                            : selectCurrentSection && selectCurrentSection.id === labeling.verbal_id
                            ? 'active'
                            : ''
                        }
                        currentSection={selectCurrentSection}
                        process={labeling.start_time <= Math.round(time) && labeling.end_time >= time}
                        onScroll={(top) => {
                          parentContainerRef.current?.scrollTo({
                            top,
                            behavior: 'smooth',
                          });
                        }}
                        selectedSection={selectedSection}
                        error={errorLabelingList.includes(labeling.verbal_id) ? 'error' : ''}
                        editRowLabelingId={selectEditRowLabelingId}
                        onEditLabeling={handleEditLabeling}
                        onDeleteLabeling={handleLabelingDelete}
                        workerType={workerType}
                        workerStatus={projectMeta?.work_status || ''}
                        onEditCancel={handleEditCancel}
                        onEditSubmit={handleEditSubmit}
                        viewerType={
                          (workerType === 'C' &&
                            (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU')) ||
                          workerType === 'V' ||
                          projectMeta?.work_status === 'RJ' ||
                          projectMeta?.work_status === null
                        }
                        handleSelectClick={handleVerbalSelectClick}
                      />
                    ))}
                    {bottomPad > 0 && <li style={{ height: `${bottomPad}px` }} />}
                  </>
                );
              })()
            : null}
          {step === 2
            ? (() => {
                const { start, end } = visibleRange;
                const total = filteredList.length;
                const topPad = start * ROW_HEIGHT;
                const bottomPad = (total - end) * ROW_HEIGHT;
                return (
                  <>
                    {topPad > 0 && <li style={{ height: `${topPad}px` }} />}
                    {filteredList.slice(start, end).map((labeling, idx) => (
                      <ParaverbalLabelingItem
                        key={`paraverbal-${start + idx}`}
                        index={start + idx}
                        labeling={labeling}
                        handleSelectChange={handleSelectChangeParaverbal}
                        onClick={handleCellSelect}
                        active={
                          selectedSection.some((selectSection) => selectSection.id === labeling.paraverbal_id)
                            ? 'active'
                            : selectCurrentSection && selectCurrentSection.id === labeling.paraverbal_id
                            ? 'active'
                            : ''
                        }
                        currentSection={selectCurrentSection}
                        process={labeling.start_time <= Math.round(time) && labeling.end_time >= time}
                        onScroll={(top) => {
                          parentContainerRef.current?.scrollTo({
                            top,
                            behavior: 'smooth',
                          });
                        }}
                        selectedSection={selectedSection}
                        editRowLabelingId={selectEditRowLabelingId}
                        onEditLabeling={handleEditLabeling}
                        onDeleteLabeling={handleLabelingDelete}
                        onEditCancel={handleEditCancel}
                        onEditSubmit={handleEditSubmit}
                        workerType={workerType}
                        viewerType={
                          (workerType === 'C' &&
                            (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU')) ||
                          workerType === 'V' ||
                          projectMeta?.work_status === 'RJ' ||
                          projectMeta?.work_status === null
                        }
                        handleSelectClick={handleParaverbalSelectClick}
                      />
                    ))}
                    {bottomPad > 0 && <li style={{ height: `${bottomPad}px` }} />}
                  </>
                );
              })()
            : null}
          {step === 3 &&
            (() => {
              const total = filteredList.length;
              const { start, end } = visibleRange;
              const topPad = start * ROW_HEIGHT;
              const bottomPad = (total - end) * ROW_HEIGHT;
              return (
                <>
                  {topPad > 0 && <li style={{ height: `${topPad}px` }} />}
                  {filteredList.slice(start, end).map((labeling, i) => {
                    const index = start + i;
                    return (
                      <NonVerbalLabelingItem
                        key={`non-verbal-${index}`}
                        index={index}
                        labeling={labeling}
                        onClick={handleCellSelect}
                        handleSelectChange={handleSelectChangeNonVerbal}
                        handleInputChange={handleInputChangeNonVerbal}
                        active={
                          selectedSection.some((selectSection) => selectSection.id === labeling.nonverbal_id)
                            ? 'active'
                            : selectCurrentSection && selectCurrentSection.id === labeling.nonverbal_id
                            ? 'active'
                            : ''
                        }
                        currentSection={selectCurrentSection}
                        process={labeling.start_time <= Math.round(time) && labeling.end_time >= time}
                        onScroll={(top) => {
                          parentContainerRef.current?.scrollTo({
                            top,
                            behavior: 'smooth',
                          });
                        }}
                        selectedSection={selectedSection}
                        error={errorLabelingList.includes(labeling.nonverbal_id) ? 'error' : ''}
                        workerType={workerType}
                        editRowLabelingId={selectEditRowLabelingId}
                        onEditLabeling={handleEditLabeling}
                        onDeleteLabeling={handleLabelingDelete}
                        onEditCancel={handleEditCancel}
                        onEditSubmit={handleEditSubmit}
                        viewerType={
                          (workerType === 'C' &&
                            (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU')) ||
                          workerType === 'V' ||
                          projectMeta?.work_status === 'RJ' ||
                          projectMeta?.work_status === null
                        }
                        handleSelectClick={handleNonVerbalSelectClick}
                      />
                    );
                  })}
                  {bottomPad > 0 && <li style={{ height: `${bottomPad}px` }} />}
                </>
              );
            })()}
        </ul>
      </div>
      <div
        className={classNames('footer', {
          'justify-end': workerType === 'V',
        })}
      >
        {workerType !== 'V' && (
          <div>
            <div className="all-delete" onClick={handleSTTAllDeleteAlert}>
              <span>전체 삭제</span>
              <AllDelete width="24" height="24" color={theme.workerColor.line2} />
            </div>
            <div className="each-delete" onClick={handleDeleteAlert}>
              <span>삭제</span>
              <Delete width="24" height="24" color={theme.workerColor.line2} />
            </div>
          </div>
        )}
        <div>
          {!!errorLabelingList.length && <div className="error-label">* no labels {errorLabelingList.length}개</div>}
          <span className="total-count">
            {selectSpeaker.length > 0 ? labelingList.filter((labeling) => selectSpeaker.includes(labeling.speaker_id)).length : labelingList.length}개
          </span>
        </div>
      </div>
      {isVerbalModal.open && (
        <div className="vad-modal" style={{ top: isVerbalModal.top, right: isVerbalModal.right }}>
          <WorkerVerbalVAD
            onConfirm={handleVerbalVadConfirm}
            onCancel={handleVerbalVadCancel}
            type={isVerbalModal.type}
            title={isVerbalModal.title}
            data={isVerbalModal.data}
            verbalId={isVerbalModal.verbalId}
            viewerType={
              (workerType === 'C' && (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU')) ||
              workerType === 'V' ||
              projectMeta?.work_status === 'RJ' ||
              projectMeta?.work_status === null
            }
          />
        </div>
      )}
    </LabelingSectionWrapper>
  );
};

export default LabelingSection;
