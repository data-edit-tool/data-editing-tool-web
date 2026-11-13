import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkerActions } from 'actions/worker-actions';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { workerJobListSelector, workerSelectJobIdSelector } from 'state/worker-job-list';
import { workerLabelingAtom, workerLabelingErrorCheckListSelector, workerLabelingMetaSelector } from 'state/worker-labeling';
import { workerLoadingSelector } from 'state/worker-loading';
import { workerTypeSelector } from 'state/worker-project';
import { styled } from 'styled-components';
import { IAlert } from 'types/interface';
import { IJobList } from 'types/worker-interface';
import { removeWorker } from 'utils/worker-storage';

import ModalContainer from 'components/Modal';
import Alert from 'components/Modal/WorkerAlert';

import Folder from '../Folder';

const FolderSectionWrapper = styled.div`
  padding: 0px 20px 0px 16px;
  position: relative;
  height: 700px;
  .up-arrow {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -47px;
    left: 46%;
    transform: translate(-50%, 0);
    background-color: ${({ theme }) => theme.workerColor.secondary};
    svg {
      transform: rotate(180deg);
    }
  }
  .down-arrow {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -47px;
    left: 46%;
    transform: translate(-50%, 0);
    background-color: ${({ theme }) => theme.workerColor.secondary};
  }
  ul {
    height: 685px;
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
    li {
      margin-bottom: 16px;
      margin-right: 4px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const FolderSection: React.FC = () => {
  const { id, workspaceId } = useParams();
  const { jobStep1Temp, jobStep2Temp, jobStep3Temp } = useWorkerActions();
  const folderList = useRecoilValue(workerJobListSelector);
  const [selectJob, setSelectJob] = useRecoilState(workerSelectJobIdSelector);
  const setSelectedSection = useSetRecoilState(selectedSectionAtom);
  const setCurrentSection = useSetRecoilState(currentSectionAtom);
  const setSeekingTime = useSetRecoilState(seekingTimeAtom);
  const setErrorLabeling = useSetRecoilState(workerLabelingErrorCheckListSelector);
  const { labelingList, originalLabelingList } = useRecoilValue(workerLabelingAtom);
  const projectMeta = useRecoilValue(workerLabelingMetaSelector);
  const workerType = useRecoilValue(workerTypeSelector);
  const setLoading = useSetRecoilState(workerLoadingSelector);
  const [folderJob, setFolderJob] = useState<IJobList | null>(null);
  const [metaStep, setMetaStep] = useState<number | null>(null);
  const [isAlert, setIsAlert] = useState<IAlert>({
    open: false,
    title: '',
    content: '',
    type: '',
    alertType: 'alert',
  });

  useEffect(() => {
    // 작업자, 검수자에 따른 step 설정
    if (projectMeta) {
      if (workerType === 'W') {
        setMetaStep(projectMeta?.step);
      } else if (workerType === 'C') {
        setMetaStep(projectMeta?.check_step);
      }
    }
  }, [projectMeta?.step, projectMeta?.check_step, workerType]);

  const onAlertSetting = (open: boolean, title: string, content: string, type: string, alertType: 'alert' | 'confirm') => {
    setIsAlert({
      open,
      title,
      content,
      type,
      alertType,
    });
  };

  const onAlertConfirm = async () => {
    try {
      // 폴더 이동시 작업파일 저장
      if (projectMeta && selectJob) {
        if (metaStep === 1) {
          await jobStep1Temp({
            workspaceId: workspaceId as string,
            projectId: id as string,
            jobId: selectJob.job_id,
            step: metaStep,
            workId: projectMeta.work_id,
          });
        } else if (metaStep === 2) {
          await jobStep2Temp({
            workspaceId: workspaceId as string,
            projectId: id as string,
            jobId: selectJob.job_id,
            step: metaStep,
            workId: projectMeta.work_id,
          });
        } else if (metaStep === 3) {
          await jobStep3Temp({
            workspaceId: workspaceId as string,
            projectId: id as string,
            jobId: selectJob.job_id,
            step: metaStep,
            workId: projectMeta.work_id,
          });
        }
        setSelectJob(folderJob);
        setSelectedSection([]);
        setCurrentSection(null);
        setSeekingTime(0);
        setErrorLabeling([]);
        setLoading(true);
        removeWorker();
        onCancel();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onCancel = () => {
    setIsAlert({
      open: false,
      title: '',
      content: '',
      type: '',
      alertType: 'alert',
    });
  };

  const handleFolderMove = (job: IJobList) => {
    if (!job.is_access) {
      return;
    }
    if (selectJob?.job_id === job.job_id) {
      return;
    }
    setFolderJob(job);
    // 폴더 이동 시 작업파일과 다르면 얼럿
    if (JSON.stringify(labelingList) !== JSON.stringify(originalLabelingList)) {
      onAlertSetting(true, '작업 저장 알림', '작업 중인 내용을 저장 하시겠습니까?', 'move', 'confirm');
      return;
    } else {
      removeWorker();
      setSelectJob(job);
      setSelectedSection([]);
      setCurrentSection(null);
      setSeekingTime(0);
      setLoading(true);
      setErrorLabeling([]);
    }
  };

  return (
    <FolderSectionWrapper>
      {isAlert.open && (
        <ModalContainer id="modal">
          <Alert title={isAlert.title} isCancel rightBtnText="저장 후 이동" content={isAlert.content} onConfirm={onAlertConfirm} onCancel={onCancel} />
        </ModalContainer>
      )}
      <ul>
        {folderList.map((folder) => (
          <Folder active={folder.job_id === selectJob?.job_id} key={folder.job_id} onClick={handleFolderMove} job={folder}>
            {folder.job_name}
          </Folder>
        ))}
      </ul>
    </FolderSectionWrapper>
  );
};

export default FolderSection;
