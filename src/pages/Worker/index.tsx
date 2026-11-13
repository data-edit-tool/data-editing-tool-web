import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkerActions } from 'actions/worker-actions';
import { useCallbackPrompt } from 'hooks/useCallbackPrompt';
import { useRecoilState, useRecoilValue } from 'recoil';
import { audioSpeakerSectionHeightAtom } from 'state/audio-speaker-section-height.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { workerJobFileSelectAudioIdSelector, workerJobFileSelectVideoIdSelector } from 'state/worker-job-file-list';
import { workerJobListSelector, workerSelectJobIdSelector } from 'state/worker-job-list';
import { workerLabelingAtom, workerLabelingEditCheckSelector, workerLabelingMetaSelector, workerLabelingViewerStepSelector } from 'state/worker-labeling';
import { workerLoadingSelector } from 'state/worker-loading';
import { workerTypeSelector } from 'state/worker-project';
import { styled } from 'styled-components';
import { IAlert } from 'types/interface';
import { ILabelingMeta } from 'types/worker-interface';
import { useElementSize } from 'usehooks-ts';
import { PATH_USER_LIST } from 'utils/path';

import AudioSection from 'components/Common/Worker/AudioSection';
import FolderSection from 'components/Common/Worker/FolderSection';
import WorkerHeader from 'components/Common/Worker/Header';
import Loading from 'components/Common/Worker/Loading';
import SpeakerSection from 'components/Common/Worker/SpeakerSection';
import StepSection from 'components/Common/Worker/StepSection';
import VideoSection from 'components/Common/Worker/VideoSection';
import ModalContainer from 'components/Modal';
import Alert from 'components/Modal/WorkerAlert';

import DialogProvider from '../../providers/dialog.provider';
import DndProvider from '../../providers/dnd.provider';

const WorkerJobWrapper = styled.div<{ status: string }>`
  width: 1776px;
  padding-right: 15px;
  ${({ status }) => status === 'ready' && `pointer-events: none;`}
`;

const WorkerWrapper = styled.div`
  background-color: ${({ theme }) => theme.workerColor.black};
  .worker-background {
    background-color: ${({ theme }) => theme.workerColor.black};
    margin: 0 auto;
    display: flex;
    justify-content: center;
    color: #fff;
    width: 1920px;
    .worker-container {
      display: flex;
      flex-direction: column;
      width: 1920px;
      .worker-bottom {
        display: flex;
        flex-direction: row;
        width: 100%;
        .worker-audio {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
`;

function Worker() {
  const navigate = useNavigate();
  const { workspaceId, id } = useParams();
  const { workerProjectFind, jobList, jobFileList, jobLabeling, jobLabelingCategoryList, jobReset } = useWorkerActions();
  const [ref, { height }] = useElementSize();
  const [_, set] = useRecoilState(audioSpeakerSectionHeightAtom);
  const workerSelectJob = useRecoilValue(workerSelectJobIdSelector);
  const projectMeta = useRecoilValue(workerLabelingMetaSelector);
  const [step, setStep] = useState<number | null>(null);
  const workerType = useRecoilValue(workerTypeSelector);
  const viewerStep = useRecoilValue(workerLabelingViewerStepSelector);
  const [loading, setLoading] = useRecoilState(workerLoadingSelector);
  const [isEditStatus, setIsEditStatus] = useRecoilState(workerLabelingEditCheckSelector);
  const selectAudio = useRecoilValue(workerJobFileSelectAudioIdSelector);
  const selectVideo = useRecoilValue(workerJobFileSelectVideoIdSelector);
  const workerJobList = useRecoilValue(workerJobListSelector);
  const [beforeProjectMeta, setBeforeProjectMeta] = useState<ILabelingMeta | null>(null);

  const [isAlert, setIsAlert] = useState<IAlert>({
    open: false,
    title: '',
    content: '',
    type: '',
    alertType: 'alert',
  });
  const [isBack, setIsBack] = useState(false);

  const { labelingList, originalLabelingList } = useRecoilValue(workerLabelingAtom);
  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(isEditStatus);
  const seekingTime = useRecoilValue(seekingTimeAtom);

  useLayoutEffect(() => {
    // Ensure the global loading overlay is visible immediately on page entry (pre-paint),
    // even if a previous session left the recoil state as `false`.
    setLoading(true);
  }, [setLoading]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (projectMeta && selectAudio && selectVideo) {
        const saveLocalStorage = {
          workId: projectMeta?.work_id,
          jobId: workerSelectJob?.job_id,
          workerId: projectMeta?.worker_id,
          audio: selectAudio,
          video: selectVideo,
          timeLine: seekingTime,
          step: step,
        };
        window.localStorage.setItem('worker', JSON.stringify(saveLocalStorage));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectAudio, selectVideo, projectMeta, workerSelectJob, seekingTime, step]);

  useEffect(() => {
    // 변경된 파일이 있으면 페이지 이동 경고
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (showPrompt) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    if (showPrompt) {
      onAlertSetting(true, '알림', '변경된 내용이 저장되지 않습니다<br/>나가시겠습니까?', 'move', 'confirm');
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showPrompt, isEditStatus]);

  useEffect(() => {
    // 기존 데이터와 바뀐데이터가 다른경우 경고창 상태 변경
    if (JSON.stringify(labelingList) !== JSON.stringify(originalLabelingList)) {
      setIsEditStatus(true);
      cancelNavigation();
      return;
    }
    setIsEditStatus(false);
  }, [JSON.stringify(labelingList), JSON.stringify(originalLabelingList)]);

  useEffect(() => {
    if (height) {
      set(height);
    }
  }, [height, set]);

  useEffect(() => {
    // 작업자 타입에 따른 step 변경
    if (projectMeta && workerType) {
      if (workerType === 'W') {
        setStep(projectMeta?.step);
      } else if (workerType === 'V' || (workerType === 'C' && (projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU'))) {
        setStep(viewerStep);
      } else if (workerType === 'C') {
        setStep(projectMeta?.check_step);
      }
    }
  }, [projectMeta?.step, projectMeta?.check_step, projectMeta?.work_status, workerType, viewerStep]);

  useEffect(() => {
    // step에 따라 카테고리 호출
    if (projectMeta?.step) {
      if (step === null || step === 1) {
        fetchJobLabelingCategoryList('verbal');
      } else if (step === 2) {
        fetchJobLabelingCategoryList('paraverbal');
      } else if (step === 3) {
        fetchJobLabelingCategoryList('nonverbal');
      }
    }
  }, [step, projectMeta?.step]);

  useEffect(() => {
    // 작업 파일이 있을 경우 파일 리스트 및 라벨링 호출
    if (workerSelectJob && workerType) {
      fetchJobLabeling(workerSelectJob.job_id);
    }
  }, [workerSelectJob, workerType]);

  useEffect(() => {
    if (projectMeta && workerSelectJob) {
      setBeforeProjectMeta(projectMeta);
      if (projectMeta.job_id !== beforeProjectMeta?.job_id) {
        fetchJobFileList(workerSelectJob.job_id);
      }
    }
  }, [beforeProjectMeta?.job_id, projectMeta, workerSelectJob]);

  useEffect(() => {
    // 프로젝트 상태, 작업파일 리스트 호출
    fetchWorkerProject();
    fetchJobList();
    setLoading(true);
    return () => {
      jobReset();
    };
  }, []);

  const onAlertSetting = (open: boolean, title: string, content: string, type: string, alertType: 'alert' | 'confirm') => {
    setIsAlert({
      open,
      title,
      content,
      type,
      alertType,
    });
  };

  const fetchWorkerProject = async () => {
    try {
      await workerProjectFind(workspaceId as string, id as string);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchJobList = async () => {
    try {
      await jobList(workspaceId as string, id as string);
    } catch (err: any) {
      // 서버에서 작업할 건이없을 경우 status true
      setIsBack(!!err.status);
      const message = workerType === 'W' ? '프로젝트 내의 모든 작업 불가 건으로 접근 불가 합니다' : '프로젝트 내의 모든 작업 불가 건으로 접근 불가 합니다';
      setLoading(false);
      onAlertSetting(true, '접근 불가 알림', message, 'inaccessible', 'alert');
    }
  };

  const fetchJobFileList = async (selectJobId: string) => {
    try {
      await jobFileList(selectJobId);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchJobLabeling = async (selectJobId: string) => {
    try {
      await jobLabeling(id as string, selectJobId);
    } catch (err: any) {
      // 서버에서 작업할 건이없을 경우 status true
      setIsBack(!!err.status);
      setLoading(false);
      if (workerSelectJob?.is_access) {
        onAlertSetting(
          true,
          '접근 불가 알림',
          workerType === 'W' ? '2차 작업중이므로 접근 불가 합니다.' : '1차 작업중이므로 접근 불가 합니다.',
          'inaccessible',
          'alert',
        );
      }
    }
  };

  const fetchJobLabelingCategoryList = async (categoryName: string) => {
    try {
      await jobLabelingCategoryList(id as string, categoryName);
    } catch (err) {
      console.log(err);
    }
  };

  const onAlertConfirm = () => {
    const isInaccessible = workerJobList.filter((item) => !item.is_access);
    if (isAlert.type === 'inaccessible' && !isBack && isInaccessible.length > 1) {
      fetchJobList();
      setLoading(true);
      onCancel();
      return;
    }
    confirmNavigation();
    navigate(PATH_USER_LIST.WORKSPACE_MANAGEMENT_DETAIL.replace(':id', workspaceId as string));
  };

  const onCancel = () => {
    setIsAlert({
      open: false,
      title: '',
      content: '',
      type: '',
      alertType: 'alert',
    });
    setIsEditStatus(true);
    cancelNavigation();
  };

  return (
    <DialogProvider>
      <DndProvider>
        {isAlert.open && (
          <ModalContainer id="modal">
            <Alert
              title={isAlert.title}
              isCancel={isAlert.alertType === 'confirm'}
              rightBtnText="확인"
              content={isAlert.content}
              onConfirm={onAlertConfirm}
              onCancel={onCancel}
            />
          </ModalContainer>
        )}
        <WorkerWrapper>
          <div className="worker-background">
            <div className="worker-container">
              <WorkerHeader />
              <StepSection />
              <div className="worker-bottom">
                <FolderSection />
                <WorkerJobWrapper
                  status={
                    projectMeta?.work_status === null ||
                    projectMeta?.work_status === 'RD' ||
                    projectMeta?.work_status === 'IM' ||
                    projectMeta?.work_status === 'RQ'
                      ? 'ready'
                      : ''
                  }
                >
                  {/* <WorkerJobWrapper status=""> */}
                  {/* <WorkerWrapper status=""> */}
                  {/* <VideoSection /> */}
                  <VideoSection />
                  <div ref={ref} className="worker-audio">
                    <AudioSection />
                    <SpeakerSection />
                  </div>
                </WorkerJobWrapper>
              </div>
            </div>
          </div>
          {loading && <Loading />}
        </WorkerWrapper>
      </DndProvider>
    </DialogProvider>
  );
}

export default Worker;
