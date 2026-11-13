import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWorkerActions } from 'actions/worker-actions';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import { scrollLeftAtom } from 'state/scrollLeft.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { timeAtom } from 'state/time.atom';
import { delayAtom } from 'state/worker-delay';
import { workerSelectJobIdSelector } from 'state/worker-job-list';
import {
  workerLabelingAtom,
  workerLabelingEditCheckSelector,
  workerLabelingErrorCheckListSelector,
  workerLabelingListSelector,
  workerLabelingMetaSelector,
  workerLabelingVerbalOriginalListSelector,
  workerLabelingVerbalResizeListSelector,
  workerLabelingViewerStepSelector,
  workerOriginalLabelingListSelector,
} from 'state/worker-labeling';
import { workerLabelingHistoryIndexSelector, workerLabelingHistoryListSelector } from 'state/worker-labeling-history-list';
import { workerLoadingSelector } from 'state/worker-loading';
import { workerModalAtom } from 'state/worker-modal';
import { workerTypeSelector } from 'state/worker-project';
import { workerSpeakerSelector } from 'state/worker-speaker';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { isCustomError } from 'utils/error';
import { isNonVerbalParing, isParaverbalParing, isVerbalParing } from 'utils/labeling-parsing';
import { removeWorker } from 'utils/worker-storage';

import ModalContainer from 'components/Modal';
import Alert from 'components/Modal/WorkerAlert';
import WorkerImpossible from 'components/Modal/WorkerImpossible';

import Button from '../Button';
import Process from '../Process';

const StepSectionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 26px;
  position: relative;
  min-height: 140px;
  ul {
    width: 1124px;
    padding: 20px 0px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    li {
      width: 33.3%;
    }
  }
  .btn-wrapper {
    margin-top: 20px;
    display: flex;
    height: 42px;
    button {
      width: 100px;
      &.temp-btn,
      &.prev-step-btn {
        margin-right: 24px;
        &.last {
          margin-right: 0;
        }
      }
      &.job-cancel-btn {
        background-color: ${({ theme }) => theme.workerColor.point};
      }
    }
  }
`;
// 3 minutes
const initialCountdown = 180;

const StepSection: React.FC = () => {
  const { jobStart, jobList, jobLabeling, jobStep1Temp, jobStep2Temp, jobStep3Temp, jobImpossibleList, jobStep1, jobStep2, jobStep3, jobUpdateStatus } =
    useWorkerActions();
  const { id, workspaceId } = useParams();
  const [projectMeta, setProjectMeta] = useRecoilState(workerLabelingMetaSelector);
  const workerSelectJob = useRecoilValue(workerSelectJobIdSelector);
  const workerType = useRecoilValue(workerTypeSelector);
  const [isAlert, setIsAlert] = useState({
    open: false,
    title: '',
    content: '',
    rightBtnText: '',
    type: '',
    isCancel: true,
  });
  const [isAlertEmpty, setIsAlertEmpty] = useState({
    open: false,
    title: '',
    content: '',
    rightBtnText: '',
    type: '',
    isCancel: true,
  });
  const [labelingList, setLabelingList] = useRecoilState(workerLabelingListSelector);
  const originalLabelingList = useRecoilValue(workerOriginalLabelingListSelector);
  const setErrorLabeling = useSetRecoilState(workerLabelingErrorCheckListSelector);
  const setSelectedSection = useSetRecoilState(selectedSectionAtom);
  const setCurrentSection = useSetRecoilState(currentSectionAtom);
  const workerLabelingData = useRecoilValue(workerLabelingAtom);
  const [metaStep, setMetaStep] = useState<number | null>(null);
  const viewerStep = useRecoilValue(workerLabelingViewerStepSelector);
  const setSeekingTime = useSetRecoilState(seekingTimeAtom);
  const setScrollLeft = useSetRecoilState(scrollLeftAtom);
  const setCurrentTime = useSetRecoilState(timeAtom);
  const [loading, setLoading] = useRecoilState(workerLoadingSelector);
  const [isWorkImpossible, setIsWorkImpossible] = useState(false);
  const [isAlertDisabled, setIsAlertDisabled] = useState(false);
  const tempBtnRef = useRef<HTMLButtonElement>(null);
  const prevStepBtnRef = useRef<HTMLButtonElement>(null);
  const nextStepBtnRef = useRef<HTMLButtonElement>(null);
  const completeBtnRef = useRef<HTMLButtonElement>(null);

  const historyLabelingList = useRecoilValue(workerLabelingHistoryListSelector);
  const [historyIndex, setHistoryIndex] = useRecoilState(workerLabelingHistoryIndexSelector);
  const setSelectSpeaker = useSetRecoilState(workerSpeakerSelector);
  const isVerbalModal = useRecoilValue(workerModalAtom);
  const setDelay = useSetRecoilState(delayAtom);
  const setVerbalLabelingList = useSetRecoilState(workerLabelingVerbalResizeListSelector);
  const verbalOriginalLabelingList = useRecoilValue(workerLabelingVerbalOriginalListSelector);
  const isEditStatus = useRecoilValue(workerLabelingEditCheckSelector);

  const [countdown, setCountdown] = useState(initialCountdown);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleTempSave = useCallback(
    async (alertStatus?: boolean) => {
      try {
        setCountdown(initialCountdown);
        setIsAlertDisabled(true);
        let resMessage: any = {};
        if (projectMeta && workerSelectJob) {
          if (metaStep === null || metaStep === 1) {
            resMessage = await jobStep1Temp({
              workspaceId: workspaceId as string,
              projectId: id as string,
              jobId: workerSelectJob.job_id,
              step: 1,
              workId: projectMeta.work_id,
            });
          } else if (metaStep === 2) {
            resMessage = await jobStep2Temp({
              workspaceId: workspaceId as string,
              projectId: id as string,
              jobId: workerSelectJob.job_id,
              step: metaStep,
              workId: projectMeta.work_id,
            });
          } else if (metaStep === 3) {
            resMessage = await jobStep3Temp({
              workspaceId: workspaceId as string,
              projectId: id as string,
              jobId: workerSelectJob.job_id,
              step: metaStep,
              workId: projectMeta.work_id,
            });
          }
        }

        if (resMessage && resMessage.message) {
          if (alertStatus) {
            toast.success('자동 저장되었습니다.');
            return;
          } else {
            handleIsAlertEmptyClose();
            setIsAlert({
              open: true,
              title: '알림',
              content: resMessage.message,
              rightBtnText: '확인',
              type: '',
              isCancel: false,
            });
            return;
          }
          //console.log(resMessage);
        }
      } catch (err) {
        handleIsAlertEmptyClose();
        if (!alertStatus) {
          setIsAlert({
            open: true,
            title: '알림',
            content: `${isCustomError(err) && err?.message ? err.message : '임시저장을 실패했습니다.'}`,
            rightBtnText: '확인',
            type: '',
            isCancel: false,
          });
        }
        return;
      } finally {
        setIsAlertDisabled(false);
      }
    },
    [id, jobStep1Temp, jobStep2Temp, jobStep3Temp, metaStep, projectMeta, workerSelectJob, workspaceId],
  );

  useEffect(() => {
    if (countdown === 0) {
      handleTempSave(true);
    }
  }, [countdown, handleTempSave]);

  useEffect(() => {
    if (isEditStatus) {
      setCountdown(initialCountdown); // 카운트다운 초기화
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0; // 카운트다운 종료
          }
          return prev - 1; // 1초씩 감소
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current); // 컴포넌트 언마운트 시 클리어
    };
  }, [isEditStatus]);

  useEffect(() => {
    // 작업자 종류에 따른 step 변경
    if (projectMeta && workerType) {
      if (workerType === 'W') {
        setMetaStep(projectMeta?.step);
      } else if (workerType === 'V' || (workerType === 'C' && (projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU'))) {
        setMetaStep(viewerStep);
      } else if (workerType === 'C') {
        setMetaStep(projectMeta?.check_step);
      }
    }
  }, [projectMeta?.step, projectMeta?.check_step, projectMeta?.work_status, workerType, viewerStep]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTemp = async () => {
    if (tempBtnRef.current) {
      tempBtnRef.current.blur();
    }
    let size = 0;
    if (metaStep === 1) {
      const labelingList = isVerbalParing(workerLabelingData.labelingList, workerLabelingData.labelingInfoList, true);
      labelingList.forEach((item) => {
        item.verbal.forEach(() => {
          size++;
        });
      });
    } else if (metaStep === 2) {
      const labelingList = isParaverbalParing(workerLabelingData.labelingList, workerLabelingData.labelingInfoList, true);
      labelingList.forEach((item) => {
        item.paraverbal.forEach(() => {
          size++;
        });
      });
    } else if (metaStep === 3) {
      const labelingList = isNonVerbalParing(workerLabelingData.labelingList, workerLabelingData.labelingInfoList, true);
      labelingList.forEach((item) => {
        item.nonverbal.forEach(() => {
          size++;
        });
      });
    }
    if (size === 0) {
      setIsAlertEmpty({
        open: true,
        title: '작업 저장 알림',
        content: '저장할 행이 없습니다. 빈 값으로 저장 하시겠습니까?',
        rightBtnText: '저장',
        type: 'temp',
        isCancel: true,
      });
      return;
    }
    setIsAlert({
      open: true,
      title: '작업 저장 알림',
      content: '작업중인 내용을 저장 하시겠습니까?',
      rightBtnText: '저장',
      type: 'temp',
      isCancel: true,
    });
  };

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (
        !loading &&
        !(document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SPAN' || document.activeElement?.tagName === 'TEXTAREA')
      ) {
        if (e.keyCode === 83 && !e.ctrlKey && !e.altKey && e.shiftKey && !e.metaKey) {
          if (projectMeta?.work_status && ['AS', 'IS', 'IC', 'RJ', 'CM', 'NU'].includes(projectMeta?.work_status) && workerType !== 'V') {
            handleTemp();
          }
        }
        // ctrl + z and command + z
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 90) {
          e.preventDefault();
          if (isVerbalModal.open) {
            setIsAlert({
              open: true,
              title: '알림',
              content: `해당 영역에서는 되돌리기가 불가합니다. 모달창을 닫은 후 되돌리기 실행 바랍니다`,
              rightBtnText: '확인',
              type: '',
              isCancel: false,
            });
            return;
          }
          if (
            projectMeta?.work_status &&
            ['AS', 'IS', 'IC', 'RJ', 'CM', 'NU'].includes(projectMeta?.work_status) &&
            workerType !== 'V' &&
            historyLabelingList.length
          ) {
            if (historyLabelingList.length) {
              setDelay(true);
              const beforeLabelingList = historyLabelingList[historyIndex - 2];
              if (beforeLabelingList) {
                if (beforeLabelingList.type === 'start') {
                  const applyLabelingList = JSON.parse(beforeLabelingList.data);
                  setHistoryIndex(1);
                  setLabelingList([...applyLabelingList]);
                  setSelectedSection([]);
                  setCurrentSection(null);
                  setSeekingTime(0);
                  setScrollLeft(0);
                  setCurrentTime(0);
                  setDelay(false);
                  setVerbalLabelingList([...verbalOriginalLabelingList]);
                } else if (beforeLabelingList.type === 'edit') {
                  const applyLabelingList = JSON.parse(beforeLabelingList.data);
                  let applyVerbalLabelingList = null;
                  if (beforeLabelingList.verbal) {
                    applyVerbalLabelingList = JSON.parse(beforeLabelingList.verbal);
                    setVerbalLabelingList(applyVerbalLabelingList);
                  }
                  let activeLabelingId: any = null;
                  setSelectSpeaker(beforeLabelingList.selectSpeaker);
                  setLabelingList(applyLabelingList);
                  setHistoryIndex((prev) => prev - 1);
                  let beforeSelectedSection = [];
                  if (workerType === 'W') {
                    if (projectMeta?.step === 1) {
                      beforeSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.verbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    } else if (projectMeta?.step === 2) {
                      beforeSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.paraverbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    } else if (projectMeta?.step === 3) {
                      beforeSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.nonverbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    }
                  } else if (workerType === 'C') {
                    if (projectMeta?.check_step === 1) {
                      beforeSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.verbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    } else if (projectMeta?.check_step === 2) {
                      beforeSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.paraverbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    } else if (projectMeta?.check_step === 3) {
                      beforeSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.nonverbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    }
                  }
                  let beforeVerbalSelectedSection = [];
                  if (applyVerbalLabelingList) {
                    beforeVerbalSelectedSection = applyVerbalLabelingList
                      .filter((item: any) => item.selected)
                      .map((item: any) => ({
                        id: item.verbal_id,
                        startTime: item.start_time / 1000,
                        endTime: item.end_time / 1000,
                      }));
                  }
                  if (beforeVerbalSelectedSection.length) {
                    if (beforeVerbalSelectedSection.length === 1) {
                      setCurrentSection(beforeVerbalSelectedSection[0]);
                      setSeekingTime(beforeVerbalSelectedSection[0].startTime);
                      setSelectedSection([]);
                    } else {
                      setSelectedSection(beforeVerbalSelectedSection);
                      setSeekingTime(beforeVerbalSelectedSection[beforeVerbalSelectedSection.length - 1].startTime);
                      setCurrentSection(null);
                    }
                  } else {
                    if (beforeSelectedSection.length) {
                      if (beforeSelectedSection.length === 1) {
                        setCurrentSection(beforeSelectedSection[0]);
                        setSeekingTime(beforeSelectedSection[0].startTime);
                        setSelectedSection([]);
                      } else {
                        setSelectedSection(beforeSelectedSection);
                        setSeekingTime(beforeSelectedSection[beforeSelectedSection.length - 1].startTime);
                        setCurrentSection(null);
                      }
                    }
                  }
                  if (beforeVerbalSelectedSection.length) {
                    activeLabelingId = applyVerbalLabelingList?.find((item: any) => item.active)?.verbal_id;
                  } else {
                    if (workerType === 'W') {
                      if (projectMeta?.step === 1) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.verbal_id;
                      } else if (projectMeta?.step === 2) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.paraverbal_id;
                      } else if (projectMeta?.step === 3) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.nonverbal_id;
                      }
                    } else if (workerType === 'C') {
                      if (projectMeta?.check_step === 1) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.verbal_id;
                      } else if (projectMeta?.check_step === 2) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.paraverbal_id;
                      } else if (projectMeta?.check_step === 3) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.nonverbal_id;
                      }
                    }
                  }
                  if (activeLabelingId) {
                    setTimeout(() => {
                      const findLabelLi = document.getElementById(activeLabelingId);
                      if (findLabelLi) {
                        findLabelLi.click();
                      }
                    }, 10);
                    setTimeout(() => {
                      setDelay(false);
                    }, 200);
                  } else {
                    setDelay(false);
                  }
                }
              }
            }
          }
        }
        // ctrl + y and command + y
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 89) {
          e.preventDefault();
          if (isVerbalModal.open) {
            setIsAlert({
              open: true,
              title: '알림',
              content: `해당 영역에서는 되돌리기가 불가합니다. 모달창을 닫은 후 되돌리기 실행 바랍니다`,
              rightBtnText: '확인',
              type: '',
              isCancel: false,
            });
            return;
          }
          if (
            projectMeta?.work_status &&
            ['AS', 'IS', 'IC', 'RJ', 'CM', 'NU'].includes(projectMeta?.work_status) &&
            workerType !== 'V' &&
            historyLabelingList.length
          ) {
            if (historyLabelingList.length) {
              setDelay(true);
              const afterLabelingList = historyLabelingList[historyIndex];
              if (afterLabelingList) {
                if (afterLabelingList.type === 'edit') {
                  const applyLabelingList = JSON.parse(afterLabelingList.data);
                  let applyVerbalLabelingList = null;
                  if (afterLabelingList.verbal) {
                    applyVerbalLabelingList = JSON.parse(afterLabelingList.verbal);
                    setVerbalLabelingList(applyVerbalLabelingList);
                  }
                  let activeLabelingId: any = null;
                  setSelectSpeaker(afterLabelingList.selectSpeaker);
                  setLabelingList(applyLabelingList);
                  setHistoryIndex((prev) => prev + 1);
                  let afterSelectedSection = [];
                  if (workerType === 'W') {
                    if (projectMeta?.step === 1) {
                      afterSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.verbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    } else if (projectMeta?.step === 2) {
                      afterSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.paraverbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    } else if (projectMeta?.step === 3) {
                      afterSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.nonverbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    }
                  } else if (workerType === 'C') {
                    if (projectMeta?.check_step === 1) {
                      afterSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.verbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    } else if (projectMeta?.check_step === 2) {
                      afterSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.paraverbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    } else if (projectMeta?.check_step === 3) {
                      afterSelectedSection = applyLabelingList
                        .filter((item: any) => item.selected)
                        .map((item: any) => ({
                          id: item.nonverbal_id,
                          startTime: item.start_time / 1000,
                          endTime: item.end_time / 1000,
                        }));
                    }
                  }
                  let afterVerbalSelectedSection = [];
                  if (applyVerbalLabelingList) {
                    afterVerbalSelectedSection = applyVerbalLabelingList
                      .filter((item: any) => item.selected)
                      .map((item: any) => ({
                        id: item.verbal_id,
                        startTime: item.start_time / 1000,
                        endTime: item.end_time / 1000,
                      }));
                  }
                  if (afterVerbalSelectedSection.length) {
                    if (afterVerbalSelectedSection.length === 1) {
                      setCurrentSection(afterVerbalSelectedSection[0]);
                      setSeekingTime(afterVerbalSelectedSection[0].startTime);
                      setSelectedSection([]);
                    } else {
                      setSelectedSection(afterVerbalSelectedSection);
                      setSeekingTime(afterVerbalSelectedSection[afterVerbalSelectedSection.length - 1].startTime);
                      setCurrentSection(null);
                    }
                  } else {
                    if (afterSelectedSection.length) {
                      if (afterSelectedSection.length === 1) {
                        setCurrentSection(afterSelectedSection[0]);
                        setSeekingTime(afterSelectedSection[0].startTime);
                        setSelectedSection([]);
                      } else {
                        setSelectedSection(afterSelectedSection);
                        setSeekingTime(afterSelectedSection[afterSelectedSection.length - 1].startTime);
                        setCurrentSection(null);
                      }
                    }
                  }
                  if (afterVerbalSelectedSection.length) {
                    activeLabelingId = applyVerbalLabelingList?.find((item: any) => item.active)?.verbal_id;
                  } else {
                    if (workerType === 'W') {
                      if (projectMeta?.step === 1) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.verbal_id;
                      } else if (projectMeta?.step === 2) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.paraverbal_id;
                      } else if (projectMeta?.step === 3) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.nonverbal_id;
                      }
                    } else if (workerType === 'C') {
                      if (projectMeta?.check_step === 1) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.verbal_id;
                      } else if (projectMeta?.check_step === 2) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.paraverbal_id;
                      } else if (projectMeta?.check_step === 3) {
                        activeLabelingId = applyLabelingList.find((item: any) => item.active)?.nonverbal_id;
                      }
                    }
                  }
                  if (activeLabelingId) {
                    setTimeout(() => {
                      const findLabelLi = document.getElementById(activeLabelingId);
                      if (findLabelLi) {
                        findLabelLi.click();
                      }
                    }, 10);
                    setTimeout(() => {
                      setDelay(false);
                    }, 200);
                  } else {
                    setDelay(false);
                  }
                }
              }
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleShortcut);

    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, [
    handleTemp,
    historyIndex,
    historyLabelingList,
    isAlert.type,
    isAlertEmpty.type,
    loading,
    projectMeta?.check_step,
    projectMeta?.step,
    projectMeta?.work_status,
    setHistoryIndex,
    setLabelingList,
    setSeekingTime,
    setSelectSpeaker,
    setSelectedSection,
    workerType,
    labelingList,
    isVerbalModal.open,
    setDelay,
    setCurrentSection,
    originalLabelingList,
    setScrollLeft,
    setCurrentTime,
    setVerbalLabelingList,
    verbalOriginalLabelingList,
  ]);

  // step에 따른 step view 상태 변경
  const projectStatus = useCallback(
    (step: number) => {
      if (workerType === 'W') {
        if (metaStep) {
          const parsingStep = Number(metaStep);
          if (step === 3 && projectMeta?.work_status === 'RQ') {
            return 'done';
          } else if (parsingStep === step) {
            return 'process';
          } else if (parsingStep > step) {
            return 'done';
          } else {
            return 'wait';
          }
        }
        if (step === 1) {
          return 'process';
        }
        return 'wait';
      } else if (workerType === 'V' || (workerType === 'C' && projectMeta?.work_status === 'IM') || projectMeta?.work_status === 'RJ') {
        if (viewerStep === 3) {
          return 'done';
        } else if (viewerStep === step) {
          return 'process';
        } else if (viewerStep > step) {
          return 'done';
        } else {
          return 'wait';
        }
      } else if (workerType === 'C') {
        if (metaStep) {
          const parsingStep = Number(metaStep);
          if (step === 3 && projectMeta?.work_status === 'RQ') {
            return 'done';
          } else if (parsingStep === step) {
            return 'process';
          } else if (parsingStep > step) {
            return 'done';
          } else {
            return 'wait';
          }
        }
        if (step === 1) {
          return 'process';
        }
        return 'wait';
      }
      return '';
    },
    [projectMeta?.work_status, workerType, metaStep, viewerStep],
  );

  // 반려,작업불가 사유 리스트
  const fetchJobImpossibleList = async (workId: string, workerStatus: string) => {
    try {
      await jobImpossibleList(workId, workerStatus);
      setIsWorkImpossible(true);
    } catch (err) {
      console.error(err);
    }
  };

  // 작업시작 버튼
  const handleJobStart = async () => {
    try {
      // 검수자인데 작업불가인 경우 작업불가 리스트모달부터 오픈
      if (workerType === 'C' && projectMeta?.work_status === 'IM') {
        fetchJobImpossibleList(projectMeta.work_id, projectMeta.work_status);
        return;
      }
      if (workerType === 'W' && workerSelectJob) {
        await jobStart({ workspaceId: workspaceId as string, projectId: id as string, jobId: workerSelectJob?.job_id });
      } else if (workerType === 'C' && projectMeta && workerSelectJob) {
        // 작업자인데 작업불가인경우 작업불가 리스트모달에서 상태를 변경해야 해서 방지코드
        if (projectMeta?.work_status === 'IM') {
          return;
        }
        await jobUpdateStatus({
          workspaceId: workspaceId as string,
          projectId: id as string,
          jobId: workerSelectJob.job_id,
          workId: projectMeta.work_id,
          status: projectMeta.work_status,
          nextStatus: projectMeta?.work_status === 'IM' ? 'IC' : 'IS',
        });
        setProjectMeta({
          ...projectMeta,
          check_step: 1,
          work_status: projectMeta?.work_status === 'IM' ? 'IC' : 'IS',
        });
      }
    } catch (err) {
      setIsAlert({
        open: true,
        title: '알림',
        content: `${isCustomError(err) && err?.message ? err.message : '작업시작을 실패했습니다.'}`,
        rightBtnText: '확인',
        type: '',
        isCancel: false,
      });
    }
  };

  // 스텝이동시 얼럿문구 (상황에 따라 다름)
  const handleStep = async (type: 'next' | 'prev') => {
    if (nextStepBtnRef.current) {
      nextStepBtnRef.current.blur();
    }
    if (prevStepBtnRef.current) {
      prevStepBtnRef.current.blur();
    }
    const workerTypeAndTitle =
      workerType === 'W' || (workerType === 'C' && projectMeta?.work_status === 'IM') || projectMeta?.work_status === 'RJ' || projectMeta?.work_status === 'IS';
    const title = workerTypeAndTitle
      ? metaStep === 3 && type === 'next'
        ? `${workerType === 'W' ? '제출' : '완료'} 알림`
        : 'Step 이동 알림'
      : 'Step 이동 알림';
    const content = workerTypeAndTitle
      ? metaStep === 3 && type === 'next'
        ? `작업한 내용을 ${workerType === 'W' ? '제출' : '완료'} 하시겠습니까?`
        : 'Step 이동하시겠습니까?'
      : 'Step 이동하시겠습니까?';
    const rightBtnText = workerTypeAndTitle ? (metaStep === 3 && type === 'next' ? (workerType === 'W' ? '제출' : '완료') : '저장 후 이동') : '이동';
    let size = 0;
    if (metaStep === 1) {
      const labelingList = isVerbalParing(workerLabelingData.labelingList, workerLabelingData.labelingInfoList, true);
      labelingList.forEach((item) => {
        item.verbal.forEach(() => {
          size++;
        });
      });
    } else if (metaStep === 2) {
      const labelingList = isParaverbalParing(workerLabelingData.labelingList, workerLabelingData.labelingInfoList, true);
      labelingList.forEach((item) => {
        item.paraverbal.forEach(() => {
          size++;
        });
      });
    } else if (metaStep === 3) {
      const labelingList = isNonVerbalParing(workerLabelingData.labelingList, workerLabelingData.labelingInfoList, true);
      labelingList.forEach((item) => {
        item.nonverbal.forEach(() => {
          size++;
        });
      });
    }
    // console.log(size);
    if (size === 0 && workerType !== 'V') {
      const emptyContent = workerTypeAndTitle
        ? metaStep === 3 && type === 'next'
          ? `저장할 행이 없습니다. 빈 값으로 작업한 내용을 ${workerType === 'W' ? '제출' : '완료'} 하시겠습니까?`
          : '저장할 행이 없습니다. 빈 값으로 Step 이동하시겠습니까?'
        : '저장할 행이 없습니다. 빈 값으로 Step 이동하시겠습니까?';
      setIsAlertEmpty({
        open: true,
        title,
        content: emptyContent,
        rightBtnText,
        type: type === 'next' ? 'nextStep' : 'prevStep',
        isCancel: true,
      });
      return;
    }
    setIsAlert({
      open: true,
      title,
      content,
      rightBtnText,
      type: type === 'next' ? 'nextStep' : 'prevStep',
      isCancel: true,
    });
  };

  // 이전 step, 임시저장, 다음 step 버튼 예외처리
  const onJobBtn = () => {
    // if (
    //   (!projectMeta?.step && workerType === 'W') ||
    //   (!projectMeta?.check_step && workerType === 'C' && (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'RQ'))
    // ) {
    //   return (
    //     <Button className="job-start-btn" variant="primary" onClick={handleJobStart}>
    //       작업시작
    //     </Button>
    //   );
    // }
    if (
      (projectMeta?.work_status === 'RD' && workerType === 'W' && (projectMeta?.step === null || projectMeta?.step === 1)) ||
      ((projectMeta?.check_step === null || projectMeta?.check_step === 1) &&
        workerType === 'C' &&
        (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'RQ'))
    ) {
      return (
        <Button className="job-start-btn" variant="primary" onClick={handleJobStart}>
          작업시작
        </Button>
      );
    }
    if (
      projectMeta?.work_status === 'AS' ||
      projectMeta?.work_status === 'IS' ||
      projectMeta?.work_status === 'IC' ||
      projectMeta?.work_status === 'RJ' ||
      (workerType === 'C' && projectMeta?.work_status === 'IM') ||
      (workerType === 'V' && (projectMeta?.work_status === 'CM' || projectMeta?.work_status === 'NU'))
    ) {
      return (
        <>
          {(metaStep === 2 || metaStep === 3 || viewerStep === 2 || viewerStep === 3) && (
            <Button
              className={classNames('prev-step-btn', { last: viewerStep === 3 })}
              variant="secondary"
              onClick={() => handleStep('prev')}
              ref={prevStepBtnRef}
            >
              이전 Step
            </Button>
          )}
          {workerType !== 'V' && (projectMeta?.work_status === 'AS' || projectMeta?.work_status === 'IS') && (
            <>
              <Button className="temp-btn" variant="secondary" onClick={handleTemp} ref={tempBtnRef}>
                임시저장
              </Button>
            </>
          )}
          {viewerStep !== 3 && (
            <Button className="next-step-btn" variant={metaStep === 3 ? 'primary' : 'secondary'} onClick={() => handleStep('next')} ref={nextStepBtnRef}>
              {metaStep === 3 ? (workerType === 'W' ? '제출하기' : '완료') : '다음 Step'}
            </Button>
          )}
        </>
      );
    } else if ((workerType === 'W' && projectMeta?.work_status === 'RQ') || (workerType === 'C' && projectMeta?.work_status === 'CM')) {
      return (
        <Button className="job-cancel-btn" variant="primary" onClick={handleSubmitCancel} ref={completeBtnRef}>
          {projectMeta?.work_status === 'RQ' ? '제출 취소' : '완료 취소'}
        </Button>
      );
    }
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
    setIsAlertEmpty({
      open: false,
      title: '',
      content: '',
      rightBtnText: '',
      type: '',
      isCancel: true,
    });
  };

  const handleEmptyCancel = () => {
    setIsAlert({
      open: false,
      title: '',
      content: '',
      rightBtnText: '',
      type: '',
      isCancel: true,
    });
    setIsAlertEmpty({
      open: false,
      title: '',
      content: '',
      rightBtnText: '',
      type: '',
      isCancel: true,
    });
    // if (tempLabelingList.length) {
    //   setLabelingList([...tempLabelingList]);
    // }
  };

  const onStartTimeAndEndTimeReset = () => {
    setSelectedSection([]);
    setCurrentSection(null);
    setSeekingTime(0);
    setScrollLeft(0);
    setCurrentTime(0);
  };

  const handleIsAlertEmptyClose = () => {
    setIsAlertEmpty({
      open: false,
      title: '',
      content: '',
      rightBtnText: '',
      type: '',
      isCancel: true,
    });
  };

  const handleConfirm = async () => {
    // 임시저장일 경우
    if (isAlert.type === 'temp' || isAlertEmpty.type === 'temp') {
      handleTempSave();
    } else if (isAlert.type === 'nextStep' || isAlertEmpty.type === 'nextStep') {
      // 다음 step으로 넘어가기
      if (projectMeta && workerSelectJob) {
        if (workerType === 'W' || (workerType === 'C' && projectMeta.work_status === 'IS')) {
          if (metaStep === 1) {
            const errorLabelingList: string[] = [];
            labelingList.forEach((item) => {
              const { affective_state, channel, sentiment, fc_intent, bc_intent, emotion, verbal_vad, overall_vad, verbal_id } = item;
              if (
                affective_state &&
                channel &&
                sentiment &&
                fc_intent &&
                bc_intent &&
                emotion &&
                verbal_vad &&
                verbal_vad.arousal !== -1 &&
                verbal_vad.dominance !== -1 &&
                verbal_vad.valence !== -1 &&
                overall_vad &&
                overall_vad.arousal !== -1 &&
                overall_vad.dominance !== -1 &&
                overall_vad.valence !== -1
              ) {
                return;
              }
              errorLabelingList.push(verbal_id);
            });
            // 빈 항목이 있으면 에러리스트에 추가
            if (errorLabelingList.length && workerType === 'C') {
              setErrorLabeling(errorLabelingList);
              handleIsAlertEmptyClose();
              setIsAlert({
                open: true,
                title: '미태깅 알림',
                content: '누락된 상태 값이 존재합니다.<br/>수정 바랍니다.',
                rightBtnText: '확인',
                type: '',
                isCancel: false,
              });
              return;
            }
            try {
              setIsAlertDisabled(true);
              await jobStep1({
                workspaceId: workspaceId as string,
                projectId: id as string,
                jobId: workerSelectJob.job_id,
                workId: projectMeta?.work_id,
                step: 1,
                moveStep: 2,
              });
              handleIsAlertEmptyClose();
            } catch (err) {
              handleIsAlertEmptyClose();
              setIsAlert({
                open: true,
                title: '알림',
                content: `${isCustomError(err) && err?.message ? err.message : '다음step을 실패했습니다.'}`,
                rightBtnText: '확인',
                type: '',
                isCancel: false,
              });
              return;
            } finally {
              setIsAlertDisabled(false);
            }
          } else if (metaStep === 2) {
            try {
              setIsAlertDisabled(true);
              await jobStep2({
                workspaceId: workspaceId as string,
                projectId: id as string,
                jobId: workerSelectJob.job_id,
                workId: projectMeta?.work_id,
                step: 2,
                moveStep: 3,
              });
              handleIsAlertEmptyClose();
            } catch (err) {
              handleIsAlertEmptyClose();
              setIsAlert({
                open: true,
                title: '알림',
                content: `${isCustomError(err) && err?.message ? err.message : '다음step을 실패했습니다.'}`,
                rightBtnText: '확인',
                type: '',
                isCancel: false,
              });
              return;
            } finally {
              setIsAlertDisabled(false);
            }
          } else if (metaStep === 3) {
            const errorLabelingList: string[] = [];
            labelingList.forEach((item) => {
              const { subject, action, obj, angle, affective_state, intent, func, emotion, nonverbal_id } = item;
              if (subject && action && obj && angle && affective_state && intent && func && emotion) {
                return;
              }
              errorLabelingList.push(nonverbal_id);
            });
            // 빈 항목이 있을 경우 에러 리스트 추가
            if (errorLabelingList.length && workerType === 'C') {
              setErrorLabeling(errorLabelingList);
              handleIsAlertEmptyClose();
              setIsAlert({
                open: true,
                title: '미태깅 알림',
                content: '누락된 상태 값이 존재합니다.<br/>수정 바랍니다.',
                rightBtnText: '확인',
                type: '',
                isCancel: false,
              });
              return;
            }
            try {
              setIsAlertDisabled(true);
              await jobStep3({
                workspaceId: workspaceId as string,
                projectId: id as string,
                jobId: workerSelectJob.job_id,
                workId: projectMeta?.work_id,
                step: 3,
                moveStep: 3,
              });
              await jobUpdateStatus({
                workspaceId: workspaceId as string,
                projectId: id as string,
                jobId: workerSelectJob.job_id,
                workId: projectMeta.work_id,
                status: projectMeta.work_status,
                nextStatus: workerType === 'W' ? 'RQ' : 'CM',
              });
              setProjectMeta({
                ...projectMeta,
                work_status: workerType === 'W' ? 'RQ' : 'CM',
              });
              // 작업상태 변경 후 작업파일 리스트 호출 (우선 주석)
              setLoading(true);
              await jobList(workspaceId as string, id as string);
              removeWorker();
              handleIsAlertEmptyClose();
            } catch (err) {
              handleIsAlertEmptyClose();
              setLoading(false);
              setIsAlert({
                open: true,
                title: '알림',
                content: `${isCustomError(err) && err?.message ? err.message : '다음step을 실패했습니다.'}`,
                rightBtnText: '확인',
                type: '',
                isCancel: false,
              });
              return;
            } finally {
              setIsAlertDisabled(false);
            }
          }
        } else {
          try {
            setIsAlertDisabled(true);
            // viewer Type일 경우 (뷰어, 검수자는 IC상황)
            await jobLabeling(id as string, workerSelectJob.job_id, viewerStep + 1);
            handleIsAlertEmptyClose();
          } catch (err) {
            console.error(err);
          } finally {
            setIsAlertDisabled(false);
          }
        }
      }
      onStartTimeAndEndTimeReset();
    } else if (isAlert.type === 'prevStep' || isAlertEmpty.type === 'prevStep') {
      // 이전 스텝
      if (projectMeta && workerSelectJob) {
        if (workerType === 'W' || (workerType === 'C' && projectMeta.work_status === 'IS')) {
          if (metaStep === 2) {
            try {
              setIsAlertDisabled(true);
              await jobStep2({
                workspaceId: workspaceId as string,
                projectId: id as string,
                jobId: workerSelectJob.job_id,
                workId: projectMeta.work_id,
                step: 2,
                moveStep: 1,
              });
            } catch (err) {
              handleIsAlertEmptyClose();
              setIsAlert({
                open: true,
                title: '알림',
                content: `${isCustomError(err) && err?.message ? err.message : '다음step을 실패했습니다.'}`,
                rightBtnText: '확인',
                type: '',
                isCancel: false,
              });
              return;
            } finally {
              setIsAlertDisabled(false);
            }
          } else if (metaStep === 3) {
            try {
              setIsAlertDisabled(true);
              await jobStep3({
                workspaceId: workspaceId as string,
                projectId: id as string,
                jobId: workerSelectJob.job_id,
                workId: projectMeta.work_id,
                step: 3,
                moveStep: 2,
              });
            } catch (err) {
              handleIsAlertEmptyClose();
              setIsAlert({
                open: true,
                title: '알림',
                content: `${isCustomError(err) && err?.message ? err.message : '다음step을 실패했습니다.'}`,
                rightBtnText: '확인',
                type: '',
                isCancel: false,
              });
              return;
            } finally {
              setIsAlertDisabled(false);
            }
          }
        } else {
          try {
            setIsAlertDisabled(true);
            await jobLabeling(id as string, workerSelectJob.job_id, viewerStep - 1);
          } catch (err) {
            console.error(err);
          } finally {
            setIsAlertDisabled(false);
          }
        }
      }
      onStartTimeAndEndTimeReset();
    }
    handleCancel();
    handleIsAlertEmptyClose();
  };

  // 제출 취소인 경우
  const handleSubmitCancel = async () => {
    if (completeBtnRef.current) {
      completeBtnRef.current.blur();
    }
    if (projectMeta && workerSelectJob) {
      await jobUpdateStatus({
        workspaceId: workspaceId as string,
        projectId: id as string,
        jobId: workerSelectJob.job_id,
        workId: projectMeta.work_id,
        status: projectMeta.work_status,
        nextStatus: workerType === 'W' ? 'AS' : 'IS',
      });
      setProjectMeta({
        ...projectMeta,
        work_status: workerType === 'W' ? 'AS' : 'IS',
      });
    }
  };

  // 반려, 작업불가 사유 닫기
  const handleWorkerImpossibleClose = async () => {
    if (
      projectMeta &&
      workerSelectJob &&
      ((workerType === 'W' && projectMeta.work_status === 'RJ') || (workerType === 'C' && projectMeta.work_status === 'IM'))
    ) {
      try {
        await jobUpdateStatus({
          workspaceId: workspaceId as string,
          projectId: id as string,
          jobId: workerSelectJob.job_id,
          workId: projectMeta.work_id,
          status: projectMeta.work_status,
          nextStatus: projectMeta.work_status === 'RJ' ? 'AS' : 'IC',
        });
        setProjectMeta({
          ...projectMeta,
          check_step: 1,
          work_status: projectMeta.work_status === 'RJ' ? 'AS' : 'IC',
        });
      } catch (err) {
        console.error(err);
      }
    }
    setIsWorkImpossible(false);
  };

  return (
    <StepSectionWrapper>
      {isAlertEmpty.open && (
        <ModalContainer id="modal">
          <Alert
            title={isAlertEmpty.title}
            content={isAlertEmpty.content}
            rightBtnText={isAlertEmpty.rightBtnText}
            onCancel={handleEmptyCancel}
            onConfirm={handleConfirm}
            isCancel={isAlertEmpty.isCancel}
            confirmDisabled={isAlertDisabled}
            color={theme.workerColor.point}
          />
        </ModalContainer>
      )}
      {isAlert.open && (
        <ModalContainer id="modal">
          <Alert
            title={isAlert.title}
            content={isAlert.content}
            rightBtnText={isAlert.rightBtnText}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            isCancel={isAlert.isCancel}
            confirmDisabled={isAlertDisabled}
          />
        </ModalContainer>
      )}
      {isWorkImpossible && (
        <ModalContainer id="modal">
          <WorkerImpossible onConfirm={handleWorkerImpossibleClose} workerStatus={projectMeta?.work_status} />
        </ModalContainer>
      )}
      <div />
      <ul>
        <li>
          <Process step={1} status={projectStatus(1)} text="Verbal 정보 태깅" />
        </li>
        <li>
          <Process step={2} status={projectStatus(2)} text="Paraverbal 정보 태깅" />
        </li>
        <li>
          <Process step={3} status={projectStatus(3)} text="Nonverbal 정보 태깅" />
        </li>
      </ul>
      <div className="btn-wrapper">{onJobBtn()}</div>
    </StepSectionWrapper>
  );
};

export default StepSection;
