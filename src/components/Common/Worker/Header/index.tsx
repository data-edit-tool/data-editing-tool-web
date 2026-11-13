/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkerActions } from 'actions/worker-actions';
import { useRecoilState, useRecoilValue } from 'recoil';
import { workerSelectJobIdSelector } from 'state/worker-job-list';
import { workerLabelingMetaSelector, workerLabelingViewerStepSelector } from 'state/worker-labeling';
import { workerLoadingSelector } from 'state/worker-loading';
import { workerProjectSelector, workerTypeSelector } from 'state/worker-project';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { isCustomError } from 'utils/error';
import { PATH_USER_LIST } from 'utils/path';
import { removeWorker } from 'utils/worker-storage';

import ModalContainer from 'components/Modal';
import Alert from 'components/Modal/WorkerAlert';
import WorkerImpossible from 'components/Modal/WorkerImpossible';
import WorkerTextareaAlert from 'components/Modal/WorkerTextareaAlert';
import ArrowReturn from 'components/SVG/Icon/ArrowReturn';
import Back from 'components/SVG/Icon/Back';
import NoWork from 'components/SVG/Icon/NoWork';

import Button from '../Button';

const WorkerHeaderWrapper = styled.div`
  width: 100%;
  background-color: #151b27;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  position: relative;
  .back-btn {
    width: 152px;
    color: ${({ theme }) => theme.workerColor.txt2};
  }

  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.workerColor.white};
  }
  .btn-wrapper {
    display: flex;
    .job-step-btn,
    .job-reason-btn,
    .return-btn {
      width: 104px;
      color: ${({ theme }) => theme.workerColor.txt2};
    }
    .job-reason-btn {
      background-color: #a83349;
      color: ${({ theme }) => theme.workerColor.txt2};
      margin-right: 24px;
    }
    .return-btn {
      margin-right: 24px;
      font-weight: bold;
    }
  }
`;

const WorkerHeader: React.FC = () => {
  const { workspaceId, id } = useParams();
  const navigate = useNavigate();
  const [isAlertWorkerImpossible, setIsAlertWorkerImpossible] = useState({
    open: false,
    title: '',
    content: '',
    placeholder: '',
    type: '',
    buttonText: '',
  });
  const [isWorkImpossible, setIsWorkImpossible] = useState(false);
  const [projectMeta, setProjectMeta] = useRecoilState(workerLabelingMetaSelector);
  const { jobUpdateStatus, jobImpossibleList, jobList } = useWorkerActions();
  const workerSelectJob = useRecoilValue(workerSelectJobIdSelector);
  const projectName = useRecoilValue(workerProjectSelector);
  const workerType = useRecoilValue(workerTypeSelector);
  const viewerStep = useRecoilValue(workerLabelingViewerStepSelector);
  const [step, setStep] = useState<number | null>(null);
  const [loading, setLoading] = useRecoilState(workerLoadingSelector);
  const [isWorkImpossibleModel, setIsWorkImpossibleModel] = useState(false);
  const [isAlert, setIsAlert] = useState({
    open: false,
    title: '',
    content: '',
  });
  const [selectWorkId, setSelectWorkId] = useState<string>('');
  const [isRejectButtonShow, setIsRejectButtonShow] = useState(false);

  useEffect(() => {
    // 작업자 종류에 따라 step 저장
    if (projectMeta && workerType) {
      if (workerType === 'W') {
        setStep(projectMeta?.step);
      } else if (workerType === 'V' || (workerType === 'C' && (projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU'))) {
        setStep(viewerStep);
      } else if (workerType === 'C') {
        setStep(projectMeta?.check_step);
      }
    }
  }, [projectMeta?.step, projectMeta?.check_step, workerType, viewerStep]);

  useEffect(() => {
    if (projectMeta && !loading) {
      // 가공자인데 반려 상태일경우 반려 사유 리스트 가져오기
      if (((workerType === 'W' && projectMeta?.work_status === 'RJ') || (workerType === 'V' && projectMeta?.work_status === 'NU')) && projectMeta) {
        if (projectMeta.work_id !== selectWorkId) {
          setSelectWorkId(projectMeta.work_id);
          fetchJobImpossibleList(projectMeta.work_id, projectMeta.work_status);
        }
      }

      if (((workerType === 'C' && projectMeta?.work_status === 'IS') || (workerType === 'W' && projectMeta?.has_rejected)) && projectMeta) {
        setSelectWorkId(projectMeta.work_id);
        const modalOpen = (workerType === 'W' && projectMeta?.work_status === 'RD') || (workerType === 'W' && !projectMeta?.has_rejected);
        fetchJobImpossibleList(projectMeta.work_id, 'RJ', modalOpen);
        // fetchJobImpossibleList(projectMeta.work_id, 'RJ');
      } else {
        setIsRejectButtonShow(false);
      }
      // 작업자는 작업불가, 작업자,검수자는 작업 불가 승인일경우 접근금지 모달 오픈
      if (
        ((workerSelectJob && workerSelectJob.is_access === false) ||
          (workerType === 'W' && (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'NU')) ||
          (workerType === 'C' && projectMeta?.work_status === 'NU') ||
          (workerType === 'V' && !(projectMeta?.work_status === 'CM' || projectMeta?.work_status === 'NU'))) &&
        !loading
      ) {
        setIsWorkImpossibleModel(true);
      }
    }
  }, [workerType, projectMeta?.work_status, workerSelectJob, loading]);

  const fetchJobImpossibleList = async (workId: string, workerStatus: string, modalStatus?: boolean) => {
    try {
      const impossibleList = await jobImpossibleList(workId, workerStatus);
      if (impossibleList && impossibleList.length && !modalStatus) {
        setIsWorkImpossible(true);
        setIsRejectButtonShow(true);
      } else {
        setIsWorkImpossible(false);
        setIsRejectButtonShow(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onBack = () => {
    removeWorker();
    navigate(PATH_USER_LIST.WORKSPACE_MANAGEMENT_DETAIL.replace(':id', workspaceId as string));
  };

  const handleCancel = () => {
    setIsAlertWorkerImpossible({
      open: false,
      title: '',
      content: '',
      placeholder: '',
      type: '',
      buttonText: '',
    });
  };

  const handleAlertCancel = () => {
    setIsAlert({
      open: false,
      title: '',
      content: '',
    });
  };

  const handleOpen = (type: 'impossible' | 'companion') => {
    setIsAlertWorkerImpossible({
      open: true,
      title: type === 'impossible' ? '작업 불가 사유' : '작업 반려',
      content:
        type === 'impossible'
          ? '사유를 입력하고 <span>작업불가</span> 버튼을 누르면<br/>작업 불가 파일로 분류됩니다.'
          : '사유를 입력하고 <span>반려</span> 버튼을 누르면<br/>작업 가능한 subset으로 이동합니다.',
      placeholder:
        type === 'impossible'
          ? '작업 불가 사유를 입력해주세요.&#13;&#10;30글자 내외로 입력 바랍니다.'
          : '반려 사유를 입력해주세요.&#13;&#10;30글자 내외로 입력 바랍니다.',
      type,
      buttonText: type === 'impossible' ? '작업불가' : '반려',
    });
  };

  const handleConfirm = async (content: string) => {
    try {
      if (projectMeta && workerSelectJob) {
        // 작업 불가 사유 모달에서 확인 버튼 누르면 상태 변경
        await jobUpdateStatus({
          workspaceId: workspaceId as string,
          projectId: id as string,
          jobId: workerSelectJob?.job_id,
          workId: projectMeta.work_id,
          status: projectMeta.work_status,
          nextStatus: isAlertWorkerImpossible.type === 'impossible' ? (workerType === 'W' ? 'IM' : 'NU') : 'RJ',
          reason: content,
        });
        setProjectMeta({
          ...projectMeta,
          work_status: isAlertWorkerImpossible.type === 'impossible' ? (workerType === 'W' ? 'IM' : 'NU') : 'RJ',
        });
        setIsWorkImpossibleModel(true);
        handleCancel();
      }
    } catch (err) {
      setIsAlert({
        open: true,
        title: '알림',
        content: `${isCustomError(err) && err?.message ? err.message : '비밀번호 재설정을 실패했습니다'}`,
      });
    }
  };

  const handleWorkerImpossibleOpen = async () => {
    try {
      if (projectMeta) {
        const workStatus = projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU' ? 'IM' : 'RJ';
        // fetchJobImpossibleList(projectMeta.work_id, workerType === 'W' ? 'RJ' : 'IM');
        fetchJobImpossibleList(projectMeta.work_id, workStatus);
      }
    } catch (err) {
      setIsAlert({
        open: true,
        title: '알림',
        content: `${isCustomError(err) && err?.message ? err.message : '비밀번호 재설정을 실패했습니다'}`,
      });
    }
  };

  const handleWorkerImpossibleClose = async () => {
    // 작업자는 반려, 검수자는 작업 불가일때 모달 오픈후 닫기 및 확인 누르면 작업상태 변경
    if (
      projectMeta &&
      workerSelectJob &&
      ((workerType === 'W' && projectMeta.work_status === 'RJ') || (workerType === 'C' && projectMeta.work_status === 'IM'))
    ) {
      try {
        await jobUpdateStatus({
          workspaceId: workspaceId as string,
          projectId: id as string,
          jobId: workerSelectJob?.job_id,
          workId: projectMeta.work_id,
          status: projectMeta.work_status,
          nextStatus: projectMeta.work_status === 'RJ' ? 'AS' : 'IC',
        });
        setProjectMeta({
          ...projectMeta,
          work_status: projectMeta.work_status === 'RJ' ? 'AS' : 'IC',
        });
      } catch (err) {
        console.error(err);
      }
    }
    setIsWorkImpossible(false);
  };

  const handleIMAlertCancel = async () => {
    try {
      setLoading(true);
      removeWorker();
      await jobList(workspaceId as string, id as string);
    } catch (err: any) {
      setLoading(false);
      if (err.status) {
        onBack();
      }
    }
    setIsWorkImpossibleModel(false);
  };

  return (
    <WorkerHeaderWrapper>
      {isWorkImpossibleModel && (
        <ModalContainer id="modal">
          <Alert
            title="접근 불가 알림"
            content={
              workerType === 'V' && !(projectMeta?.work_status === 'CM' || projectMeta?.work_status === 'NU')
                ? '작업중이므로 접근 불가 합니다'
                : projectMeta?.work_status === 'RJ'
                ? '반려 건으로 접근 불가 합니다.'
                : workerType === 'W' && projectMeta?.work_status === 'AS'
                ? '다른 작업자 작업건으로 접근 불가 합니다'
                : '작업 불가 건으로 접근 불가합니다.'
            }
            rightBtnText="확인"
            onCancel={handleIMAlertCancel}
            onConfirm={handleIMAlertCancel}
          />
        </ModalContainer>
      )}
      {isAlert.open && (
        <ModalContainer id="modal">
          <Alert title={isAlert.title} content={isAlert.content} rightBtnText="확인" onCancel={handleAlertCancel} onConfirm={handleAlertCancel} />
        </ModalContainer>
      )}
      {isAlertWorkerImpossible.open && (
        <ModalContainer id="modal">
          <WorkerTextareaAlert
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            title={isAlertWorkerImpossible.title}
            content={isAlertWorkerImpossible.content}
            placeHolder={isAlertWorkerImpossible.placeholder}
            buttonText={isAlertWorkerImpossible.buttonText}
          />
        </ModalContainer>
      )}
      {isWorkImpossible && (
        <ModalContainer id="modal">
          <WorkerImpossible onConfirm={handleWorkerImpossibleClose} workerStatus={projectMeta?.work_status} />
        </ModalContainer>
      )}
      <Button className="back-btn" variant="secondary" onClick={onBack}>
        <Back width="20" height="20" color="#bdbdbd" />
        목록으로 나가기
      </Button>
      <div className="title">{projectName}</div>

      {step !== null && projectMeta?.work_status !== 'IM' && (
        <div className="btn-wrapper">
          {(projectMeta?.work_status === 'IC' ||
            projectMeta?.work_status === 'RJ' ||
            projectMeta?.work_status === 'AS' ||
            projectMeta?.work_status === 'IS' ||
            projectMeta?.work_status === 'NU') && (
            <>
              {((workerType === 'W' && projectMeta?.work_status === 'RJ') ||
                (workerType === 'C' && projectMeta?.work_status === 'IC') ||
                (workerType === 'C' && projectMeta?.work_status === 'IS' && isRejectButtonShow) ||
                (workerType === 'V' && projectMeta?.work_status === 'NU') ||
                (workerType === 'W' && projectMeta?.has_rejected)) && (
                <Button className="job-reason-btn" variant="secondary" onClick={handleWorkerImpossibleOpen}>
                  {projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU' ? '작업 불가 사유' : '반려 사유'}
                </Button>
              )}
              {workerType === 'C' && (projectMeta?.work_status === 'IS' || projectMeta?.work_status === 'IC') && (
                <Button className="return-btn" variant="secondary" onClick={() => handleOpen('companion')}>
                  <ArrowReturn width="20" height="20" color={theme.workerColor.line2} />
                  반려
                </Button>
              )}
            </>
          )}
          {((workerType === 'W' && projectMeta?.work_status === 'AS') || (workerType === 'C' && projectMeta?.work_status === 'IC')) && (
            <Button className="job-step-btn" variant="secondary" onClick={() => handleOpen('impossible')}>
              <NoWork width="20" height="20" color={theme.workerColor.line2} />
              작업 불가
            </Button>
          )}
        </div>
      )}
    </WorkerHeaderWrapper>
  );
};

export default WorkerHeader;
