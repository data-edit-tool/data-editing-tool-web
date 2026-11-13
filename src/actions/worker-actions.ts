import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import durationAtom from 'state/duration.atom';
import { isPlayAtom } from 'state/isPlay.atom';
import { repeatAtom } from 'state/repeat.atom';
import { scrollLeftAtom } from 'state/scrollLeft.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { speedAtom } from 'state/speed.atom';
import { timeAtom } from 'state/time.atom';
import { workerImpossibleListAtom } from 'state/worker-impossible-list';
import { workerJobFileAudioAtom } from 'state/worker-job-file-audio';
import { workerJobFileListAtom } from 'state/worker-job-file-list';
import { workerJobFileVideoAtom } from 'state/worker-job-file-video';
import { workerJobListAtom } from 'state/worker-job-list';
import {
  workerLabelingAtom,
  workerLabelingErrorCheckListSelector,
  workerLabelingInfoListSelector,
  workerLabelingMetaSelector,
  workerLabelingVerbalOriginalListSelector,
  workerLabelingVerbalResizeListSelector,
  workerLabelingViewerStepSelector,
} from 'state/worker-labeling';
import { workerLabelingCategoryAtom } from 'state/worker-labeling-category-list';
import { workerLabelingHistoryListSelector } from 'state/worker-labeling-history-list';
import { workerLoadingSelector } from 'state/worker-loading';
import { workerModalAtom } from 'state/worker-modal';
import { workerProjectAtom, workerTypeSelector } from 'state/worker-project';
import { workerTempLabelingListSelector } from 'state/worker-temp-labeling';
import { zoomAtom } from 'state/zoom.atom';
import { IApi } from 'types/interface';
import {
  IJobFile,
  IJobFileList,
  IJobLabelingCategory,
  IJobListData,
  IJobStartFormLabeling,
  IJobStep2FormLabeling,
  IJobStep3FormLabeling,
  ILabelingData,
  IWorkerImpossibleList,
  IWorkerProject,
} from 'types/worker-interface';
import axios from 'utils/axios';
import { isNonVerbalParing, isParaverbalParing, isVerbalCompareParing, isVerbalParing } from 'utils/labeling-parsing';
import { getSaveWorker, removeWorker } from 'utils/worker-storage';

function useWorkerActions() {
  const setProject = useSetRecoilState(workerProjectAtom);
  const projectMeta = useRecoilValue(workerLabelingMetaSelector);
  const setLoading = useSetRecoilState(workerLoadingSelector);
  const [workerJobList, setWorkerJobList] = useRecoilState(workerJobListAtom);
  const setWorkerJobFileList = useSetRecoilState(workerJobFileListAtom);
  const setWorkerJobFileVideo = useSetRecoilState(workerJobFileVideoAtom);
  const setWorkerJobFileAudio = useSetRecoilState(workerJobFileAudioAtom);
  const [workerLabelingData, setWorkerLabelingData] = useRecoilState(workerLabelingAtom);
  const setWorkerLabelingCategoryData = useSetRecoilState(workerLabelingCategoryAtom);
  const setErrorLabeling = useSetRecoilState(workerLabelingErrorCheckListSelector);
  const workerType = useRecoilValue(workerTypeSelector);
  const viewerStep = useRecoilValue(workerLabelingViewerStepSelector);
  const setWorkerImpossibleList = useSetRecoilState(workerImpossibleListAtom);
  const setSection = useSetRecoilState(selectedSectionAtom);
  const setCurrentSection = useSetRecoilState(currentSectionAtom);
  const labelingInfoList = useRecoilValue(workerLabelingInfoListSelector);
  const setScrollWidth = useSetRecoilState(scrollWidthAtom);
  const setScrollLeft = useSetRecoilState(scrollLeftAtom);
  const setCurrentTime = useSetRecoilState(timeAtom);
  const setDuration = useSetRecoilState(durationAtom);
  const setIsPlay = useSetRecoilState(isPlayAtom);
  const setRepeat = useSetRecoilState(repeatAtom);
  const setSeekingTime = useSetRecoilState(seekingTimeAtom);
  const setSpeed = useSetRecoilState(speedAtom);
  const setZoom = useSetRecoilState(zoomAtom);
  const setHistoryLabelingList = useSetRecoilState(workerLabelingHistoryListSelector);
  const setTempLabelingList = useSetRecoilState(workerTempLabelingListSelector);
  const setIsVerbalModal = useSetRecoilState(workerModalAtom);
  const verbalList = useRecoilValue(workerLabelingVerbalResizeListSelector);
  const originalVerbalList = useRecoilValue(workerLabelingVerbalOriginalListSelector);

  // 워커 화면 프로젝트 이름 및 워커 타입 조회
  async function workerProjectFind(workspaceId: string, projectId: string) {
    try {
      const query = {
        workspace_id: workspaceId,
        project_id: projectId,
      };
      const url = `/project/find?${qs.stringify(query)}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IWorkerProject>> = await axios.get(url);
      if (result && code === 'F000') {
        setProject({
          projectName: data.project_name,
          type: data.user_type,
        });
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 작업할 파일 리스트 조회
  async function jobList(workspaceId: string, projectId: string) {
    try {
      const url = `/job/list?project_id=${projectId}&workspace_id=${workspaceId}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IJobListData>> = await axios.get(url);
      if (result && code === 'F000') {
        // 작업할 파일이 있으면 숫자로 옴
        if (data.target_idx === null) {
          throw { code, message, status: true };
        }
        const saveWorker = getSaveWorker();
        const nextJobId = data.list[data.target_idx];
        if (workerJobList?.selectJobId?.job_id === nextJobId.job_id) {
          setLoading(false);
          return;
        }
        let targetIdx = data.target_idx;
        if (saveWorker) {
          const findIndex = data.list.findIndex((item) => item.job_id === saveWorker.jobId);
          if (findIndex !== -1) {
            targetIdx = findIndex;
          }
        }
        setWorkerJobList({
          list: data.list,
          selectJobId: data.list[targetIdx],
        });
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 해당 작업파일에 오디오, 비디오 리스트
  async function jobFileList(jobId: string) {
    try {
      const url = `/job/file/list?job_id=${jobId}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IJobFileList[]>> = await axios.get(url);
      if (result && code === 'F000') {
        const videoList = data.filter((item) => item.file_type === 'VIDEO');
        const audioList = data.filter((item) => item.file_type === 'AUDIO');
        const saveWorker = getSaveWorker();
        let selectAudioId = audioList.length ? audioList[0] : null;
        let selectVideoId = videoList.length ? videoList[0] : null;
        if (saveWorker && projectMeta) {
          const saveAudio = saveWorker.audio;
          const saveVideo = saveWorker.video;
          if (
            saveWorker.workId === projectMeta.work_id &&
            saveWorker.jobId === projectMeta.job_id &&
            saveWorker.workerId === projectMeta.worker_id &&
            saveWorker.audio
          ) {
            const findAudio = audioList.find((audio) => audio.file_url === saveAudio.file_url);
            if (findAudio) {
              selectAudioId = findAudio;
            }
          }
          if (
            saveWorker.workId === projectMeta.work_id &&
            saveWorker.jobId === projectMeta.job_id &&
            saveWorker.workerId === projectMeta.worker_id &&
            saveWorker.video
          ) {
            const findVideo = videoList.find((video) => video.file_url === saveVideo.file_url);
            if (findVideo) {
              selectVideoId = findVideo;
            }
          }
        }
        setWorkerJobFileList({
          videoList,
          audioList,
          selectVideoId,
          selectAudioId,
        });
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 해당 작업파일 비디오 정보 받아오기 (현재는 안씀)
  async function jobFileVideo(fileId: string) {
    try {
      const url = `/job/file/find?file_id=${fileId}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IJobFile>> = await axios.get(url);
      if (result && code === 'F000') {
        setWorkerJobFileVideo({
          fileId: data.file_id,
          fileOrgName: data.file_org_name,
          filePath: data.file_path,
          fileUrl: data.file_url,
          fileType: data.file_type,
        });
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 해당 작업파일 오디오 정보 받아오기 (현재는 안씀)
  async function jobFileAudio(fileId: string) {
    try {
      const url = `/job/file/find?file_id=${fileId}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IJobFile>> = await axios.get(url);
      if (result && code === 'F000') {
        setWorkerJobFileAudio({
          fileId: data.file_id,
          fileOrgName: data.file_org_name,
          filePath: data.file_path,
          fileUrl: data.file_url,
          fileType: data.file_type,
        });
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 라벨링 조회
  async function jobLabeling(projectId: string, job_id: string, viewStep?: number) {
    try {
      const queryData = {
        project_id: projectId,
        job_id,
      } as {
        project_id: string;
        job_id: string;
        step?: number;
      };
      // viewerStep이 있으면 뷰어 및 검수자에서 IS인 상황에서 넘어온거
      if (viewStep) {
        queryData.step = viewStep;
      }
      const url = `/job/findLabeling?${qs.stringify(queryData)}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<ILabelingData>> = await axios.get(url);
      if (result && code === 'F000') {
        // 해당 상태면 작업 불가
        if (
          workerType === 'W' &&
          !(
            data.meta.work_status === null ||
            data.meta.work_status === 'AS' ||
            data.meta.work_status === 'RQ' ||
            data.meta.work_status === 'RJ' ||
            data.meta.work_status === 'RD'
          )
        ) {
          throw { code, message };
        }
        if (workerType === 'C' && (data.meta.work_status === 'AS' || data.meta.work_status === 'RJ')) {
          throw { code, message };
        }
        let step: number | null = 1;
        // 처음에 작업 시작할때는 null임 그리고 해당상태에 맞게 step 설정
        if (
          (data.meta.step === null && workerType === 'W') ||
          (data.meta.check_step === null && workerType === 'C' && (data.meta.work_status === 'IM' || data.meta.work_status === 'RQ'))
        ) {
          step = null;
        } else if (workerType === 'W') {
          step = Number(data.meta.step);
        } else if (workerType === 'V' || (workerType === 'C' && data.meta.work_status === 'IC')) {
          // 뷰어 및 검수자는 IC 상황일 경우
          step = viewStep || 1;
        } else if (workerType === 'C') {
          step = Number(data.meta.check_step);
        }
        setWorkerLabelingData({
          meta: data.meta,
          originalLabelingList: step === null || step === 1 ? [...data.verbal] : [...data.labeling_all],
          labelingList: step === null || step === 1 ? [...data.verbal] : [...data.labeling_all],
          speakers: data.speakers,
          verbalList: data.verbal || [],
          originalVerbalList: data.verbal || [],
          errorCheckList: [],
          selectLabeling: '',
          labelingInfoList: data.labeling_info,
          selectEditLabeling: '',
          viewerStep: viewStep || 1,
          editCheck: false,
        });
        setHistoryLabelingList([
          {
            type: 'start',
            data: JSON.stringify(step === null || step === 1 ? data.verbal : data.labeling_all),
            selectSpeaker: [],
          },
        ]);
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // step에 맞는 카테고리 목록 조회
  async function jobLabelingCategoryList(projectId: string, categoryName: string) {
    try {
      const url = `/category/find?project_id=${projectId}&ctg_name=${categoryName}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IJobLabelingCategory[]>> = await axios.get(url);
      if (result && code === 'F000' && projectMeta) {
        let step: number | null = 1;
        if ((projectMeta.step === null && workerType === 'W') || (projectMeta.check_step === null && workerType === 'C')) {
          step = null;
        } else if (workerType === 'W') {
          step = Number(projectMeta.step);
        } else if (workerType === 'C' && projectMeta.work_status !== 'IC') {
          step = Number(projectMeta.check_step);
        } else if (workerType === 'V' || (workerType === 'C' && projectMeta.work_status === 'IC')) {
          step = viewerStep;
        }
        // 스텝에 맞는 카테고리 저장
        if (step === null || step === 1) {
          setWorkerLabelingCategoryData((prev) => ({
            ...prev,
            affectiveList: data.find((item) => item.ctg_name === 'affective_state') || null,
            channelList: data.find((item) => item.ctg_name === 'channel') || null,
            sentimentList: data.find((item) => item.ctg_name === 'sentiment') || null,
            fcIntentList: data.find((item) => item.ctg_name === 'FC_intent') || null,
            bcIntentList: data.find((item) => item.ctg_name === 'BC_intent') || null,
            emotionList: data.find((item) => item.ctg_name === 'emotion') || null,
            verbalVADList: data.find((item) => item.ctg_name === 'verbal_VAD') || null,
            overallVADList: data.find((item) => item.ctg_name === 'overall_VAD') || null,
          }));
        } else if (step === 2) {
          setWorkerLabelingCategoryData((prev) => ({
            ...prev,
            paraverbalList: data,
          }));
        } else if (step === 3) {
          setWorkerLabelingCategoryData((prev) => ({
            ...prev,
            angleList: data.find((item) => item.ctg_name === 'angle') || null,
            gSubjectList: data.find((item) => item.ctg_name === 'G-subject') || null,
            gActionList: data.find((item) => item.ctg_name === 'G-action') || null,
            gObjectList: data.find((item) => item.ctg_name === 'G-object') || null,
            intentList: data.find((item) => item.ctg_name === 'Intent') || null,
            funcList: data.find((item) => item.ctg_name === 'function') || null,
            nonVerbalEmotionList: data.find((item) => item.ctg_name === 'emotion') || null,
            nonVerbalAffectiveList: data.find((item) => item.ctg_name === 'affective_state') || null,
          }));
        }
      } else {
        throw { code, message };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // 작업시작
  async function jobStart({ workspaceId, projectId, jobId }: { workspaceId: string; projectId: string; jobId: string }) {
    try {
      const url = '/job/start';
      const labelingList = isVerbalParing(workerLabelingData.labelingList, labelingInfoList, true);
      const formData = {
        workspace_id: workspaceId,
        project_id: projectId,
        job_id: jobId,
        labelings: labelingList,
      } as {
        workspace_id: string;
        project_id: string;
        job_id: string;
        labelings: IJobStartFormLabeling[];
      };

      const {
        data: { code, data, message, result },
      }: AxiosResponse<IApi<ILabelingData>> = await axios.post(url, formData);
      if (result && code === 'F000') {
        setWorkerLabelingData({
          meta: data.meta,
          originalLabelingList: data.verbal,
          labelingList: data.verbal,
          verbalList: [],
          originalVerbalList: [],
          speakers: data.speakers,
          errorCheckList: [],
          selectLabeling: '',
          labelingInfoList: data.labeling_info,
          selectEditLabeling: '',
          viewerStep: 1,
          editCheck: false,
        });
        setHistoryLabelingList([
          {
            type: 'start',
            data: JSON.stringify(data.verbal),
            selectSpeaker: [],
          },
        ]);
        setTempLabelingList([]);
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // step1 임시저장
  async function jobStep1Temp({
    workspaceId,
    projectId,
    jobId,
    step,
    workId,
  }: {
    workspaceId: string;
    projectId: string;
    jobId: string;
    step: number;
    workId: string;
  }) {
    try {
      const url = '/work/labeling/save';
      // 서버에 보낼수있게 데이터 파싱
      const labelingList = isVerbalParing(workerLabelingData.labelingList, labelingInfoList, true);
      // const isCheck = isVerbalCheck(labelingList);
      // if (isCheck) {
      //   throw { code: 'F001', message: '라벨링 구간이 중복됩니다.' };
      // }
      const formData = {
        step,
        work_id: workId,
        workspace_id: workspaceId,
        project_id: projectId,
        job_id: jobId,
        labelings: labelingList,
      } as {
        workspace_id: string;
        project_id: string;
        job_id: string;
        labelings: IJobStartFormLabeling[];
      };
      const {
        data: { code, message, result },
      }: AxiosResponse<IApi<ILabelingData>> = await axios.post(url, formData);
      if (!result || code !== 'F000') {
        throw { code, message };
      }
      removeWorker();
      setWorkerLabelingData({
        ...workerLabelingData,
        originalLabelingList: workerLabelingData.labelingList,
        labelingList: workerLabelingData.labelingList,
      });
      return { code, message };
    } catch (err) {
      throw err;
    }
  }

  // step2 임시저장
  async function jobStep2Temp({
    workspaceId,
    projectId,
    jobId,
    step,
    workId,
  }: {
    workspaceId: string;
    projectId: string;
    jobId: string;
    step: number;
    workId: string;
  }) {
    try {
      // 변경된 verbalList와 원본 verbalList 비교
      const url = '/work/labeling/save';
      // 서버에 보낼수있게 데이터 파싱
      const filterVerbalList = isVerbalCompareParing(originalVerbalList, verbalList);
      const labelingList = isParaverbalParing(workerLabelingData.labelingList, labelingInfoList, true);
      const parsingLabelingList = labelingList.map((item) => {
        filterVerbalList.forEach((verbalItem) => {
          if (item.labeling_id === verbalItem.labeling_id) {
            item.verbal.push({
              start_time: verbalItem.start_time,
              end_time: verbalItem.end_time,
              sentence: verbalItem.sentence,
              verbal_id: verbalItem.verbal_id,
            });
            return item;
          }
        });
        return item;
      });
      const formData = {
        step,
        work_id: workId,
        workspace_id: workspaceId,
        project_id: projectId,
        job_id: jobId,
        labelings: parsingLabelingList,
      } as {
        workspace_id: string;
        project_id: string;
        job_id: string;
        labelings: IJobStep2FormLabeling[];
      };
      const {
        data: { code, message, result, data },
      }: AxiosResponse<IApi<ILabelingData>> = await axios.post(url, formData);
      if (!result || code !== 'F000') {
        throw { code, message };
      }
      removeWorker();
      setWorkerLabelingData({
        meta: data.meta,
        originalLabelingList: data.labeling_all,
        labelingList: data.labeling_all,
        speakers: data.speakers,
        verbalList: data.verbal || [],
        originalVerbalList: data.verbal || [],
        errorCheckList: [],
        selectLabeling: '',
        labelingInfoList: data.labeling_info,
        selectEditLabeling: '',
        viewerStep: 1,
        editCheck: false,
      });
      return { code, message };
    } catch (err) {
      throw err;
    }
  }

  // step3 임시저장
  async function jobStep3Temp({
    workspaceId,
    projectId,
    jobId,
    step,
    workId,
  }: {
    workspaceId: string;
    projectId: string;
    jobId: string;
    step: number;
    workId: string;
  }) {
    try {
      const filterVerbalList = isVerbalCompareParing(originalVerbalList, verbalList);
      const url = '/work/labeling/save';
      // 서버에 보낼수있게 데이터 파싱
      const labelingList = isNonVerbalParing(workerLabelingData.labelingList, labelingInfoList, true);
      const parsingLabelingList = labelingList.map((item) => {
        filterVerbalList.forEach((verbalItem) => {
          if (item.labeling_id === verbalItem.labeling_id) {
            item.verbal.push({
              start_time: verbalItem.start_time,
              end_time: verbalItem.end_time,
              sentence: verbalItem.sentence,
              verbal_id: verbalItem.verbal_id,
            });
            return item;
          }
        });
        return item;
      });
      const formData = {
        step,
        work_id: workId,
        workspace_id: workspaceId,
        project_id: projectId,
        job_id: jobId,
        labelings: parsingLabelingList,
      } as {
        workspace_id: string;
        project_id: string;
        job_id: string;
        labelings: IJobStep3FormLabeling[];
      };
      const {
        data: { code, message, result, data },
      }: AxiosResponse<IApi<ILabelingData>> = await axios.post(url, formData);
      //console.log(result, code);
      if (!result || code !== 'F000') {
        throw { code, message };
      }
      removeWorker();
      setWorkerLabelingData({
        meta: data.meta,
        originalLabelingList: data.labeling_all,
        labelingList: data.labeling_all,
        speakers: data.speakers,
        verbalList: data.verbal || [],
        originalVerbalList: data.verbal || [],
        errorCheckList: [],
        selectLabeling: '',
        labelingInfoList: data.labeling_info,
        selectEditLabeling: '',
        viewerStep: 1,
        editCheck: false,
      });
      return { code, message };
    } catch (err) {
      throw err;
    }
  }

  // step1 저장 후 step2 이동
  async function jobStep1({
    workspaceId,
    projectId,
    jobId,
    step,
    moveStep,
    workId,
  }: {
    workspaceId: string;
    projectId: string;
    jobId: string;
    step: number;
    moveStep: number;
    workId: string;
  }) {
    try {
      const url = '/work/labeling/save';
      // 서버에 보낼수있게 데이터 파싱
      const labelingList = isVerbalParing(workerLabelingData.labelingList, labelingInfoList, true);
      // const isCheck = isVerbalCheck(labelingList);
      // if (isCheck) {
      //   throw { code: 'F001', message: '라벨링 구간이 중복됩니다.' };
      // }
      const formData = {
        step,
        work_id: workId,
        workspace_id: workspaceId,
        project_id: projectId,
        move_step: moveStep,
        job_id: jobId,
        labelings: labelingList,
      } as {
        step: number;
        workspace_id: string;
        project_id: string;
        job_id: string;
        move_step: number;
        labelings: IJobStartFormLabeling[];
      };
      const {
        data: { code, message, result, data },
      }: AxiosResponse<IApi<ILabelingData>> = await axios.post(url, formData);
      if (!result || code !== 'F000') {
        throw { code, message };
      }
      removeWorker();
      setWorkerLabelingData({
        meta: data.meta,
        originalLabelingList: data.labeling_all,
        labelingList: data.labeling_all,
        speakers: data.speakers,
        verbalList: data.verbal || [],
        originalVerbalList: data.verbal || [],
        errorCheckList: [],
        selectLabeling: '',
        labelingInfoList: data.labeling_info,
        selectEditLabeling: '',
        viewerStep: 1,
        editCheck: false,
      });
      setErrorLabeling([]);
      setHistoryLabelingList([
        {
          type: 'start',
          data: JSON.stringify(data.labeling_all),
          selectSpeaker: [],
        },
      ]);
      setTempLabelingList([]);
    } catch (err) {
      throw err;
    }
  }

  // step2에서 저장 후 step3로 이동
  async function jobStep2({
    workspaceId,
    projectId,
    jobId,
    step,
    moveStep,
    workId,
  }: {
    workspaceId: string;
    projectId: string;
    jobId: string;
    step: number;
    moveStep: number;
    workId: string;
  }) {
    try {
      const url = '/work/labeling/save';
      // 서버에 보낼수있게 데이터 파싱
      const filterVerbalList = isVerbalCompareParing(originalVerbalList, verbalList);
      const labelingList = isParaverbalParing(workerLabelingData.labelingList, labelingInfoList, true);
      const parsingLabelingList = labelingList.map((item) => {
        filterVerbalList.forEach((verbalItem) => {
          if (item.labeling_id === verbalItem.labeling_id) {
            item.verbal.push({
              start_time: verbalItem.start_time,
              end_time: verbalItem.end_time,
              sentence: verbalItem.sentence,
              verbal_id: verbalItem.verbal_id,
            });
            return item;
          }
        });
        return item;
      });
      const formData = {
        step,
        work_id: workId,
        workspace_id: workspaceId,
        project_id: projectId,
        move_step: moveStep,
        job_id: jobId,
        labelings: parsingLabelingList,
      } as {
        step: number;
        workspace_id: string;
        project_id: string;
        job_id: string;
        move_step: number;
        labelings: IJobStep2FormLabeling[];
      };
      const {
        data: { code, message, result, data },
      }: AxiosResponse<IApi<ILabelingData>> = await axios.post(url, formData);
      if (!result || code !== 'F000') {
        throw { code, message };
      }
      let metaStep: number | null = 1;
      if ((data.meta.step === null && workerType === 'W') || (data.meta.check_step === null && workerType === 'C')) {
        metaStep = null;
      } else if (workerType === 'W') {
        metaStep = Number(data.meta.step);
      } else if (workerType === 'C') {
        metaStep = Number(data.meta.check_step);
      }
      removeWorker();
      setWorkerLabelingData({
        meta: data.meta,
        originalLabelingList: metaStep === null || metaStep === 1 ? data.verbal : data.labeling_all,
        labelingList: metaStep === null || Number(metaStep) === 1 ? data.verbal : data.labeling_all,
        speakers: data.speakers,
        verbalList: data.verbal || [],
        originalVerbalList: data.verbal || [],
        errorCheckList: [],
        selectLabeling: '',
        labelingInfoList: data.labeling_info,
        selectEditLabeling: '',
        viewerStep: 1,
        editCheck: false,
      });
      setErrorLabeling([]);
      setHistoryLabelingList([
        {
          type: 'start',
          data: JSON.stringify(metaStep === null || Number(metaStep) === 1 ? data.verbal : data.labeling_all),
          selectSpeaker: [],
        },
      ]);
      setTempLabelingList([]);
    } catch (err) {
      throw err;
    }
  }

  // step3저장
  async function jobStep3({
    workspaceId,
    projectId,
    jobId,
    step,
    moveStep,
    workId,
  }: {
    workspaceId: string;
    projectId: string;
    jobId: string;
    step: number;
    moveStep: number;
    workId: string;
  }) {
    try {
      const url = '/work/labeling/save';
      // 서버에 보낼수있게 데이터 파싱
      const filterVerbalList = isVerbalCompareParing(originalVerbalList, verbalList);
      const labelingList = isNonVerbalParing(workerLabelingData.labelingList, labelingInfoList, true);
      const parsingLabelingList = labelingList.map((item) => {
        filterVerbalList.forEach((verbalItem) => {
          if (item.labeling_id === verbalItem.labeling_id) {
            item.verbal.push({
              start_time: verbalItem.start_time,
              end_time: verbalItem.end_time,
              sentence: verbalItem.sentence,
              verbal_id: verbalItem.verbal_id,
            });
            return item;
          }
        });
        return item;
      });
      const formData = {
        step,
        work_id: workId,
        workspace_id: workspaceId,
        project_id: projectId,
        move_step: moveStep,
        job_id: jobId,
        labelings: parsingLabelingList,
      } as {
        step: number;
        workspace_id: string;
        project_id: string;
        job_id: string;
        move_step: number;
        labelings: IJobStep3FormLabeling[];
      };
      const {
        data: { code, message, result, data },
      }: AxiosResponse<IApi<ILabelingData>> = await axios.post(url, formData);
      if (!result || code !== 'F000') {
        throw { code, message };
      }
      let metaStep: number | null = 1;
      if ((data.meta.step === null && workerType === 'W') || (data.meta.check_step === null && workerType === 'C')) {
        metaStep = null;
      } else if (workerType === 'W') {
        metaStep = Number(data.meta.step);
      } else if (workerType === 'C') {
        metaStep = Number(data.meta.check_step);
      }
      removeWorker();
      setWorkerLabelingData({
        meta: data.meta,
        originalLabelingList: metaStep === null || metaStep === 1 ? data.verbal : data.labeling_all,
        labelingList: metaStep === null || Number(metaStep) === 1 ? data.verbal : data.labeling_all,
        speakers: data.speakers,
        verbalList: data.verbal || [],
        originalVerbalList: data.verbal || [],
        errorCheckList: [],
        selectLabeling: '',
        labelingInfoList: data.labeling_info,
        selectEditLabeling: '',
        viewerStep: 1,
        editCheck: false,
      });
      setErrorLabeling([]);
      setHistoryLabelingList([
        {
          type: 'start',
          data: JSON.stringify(metaStep === null || Number(metaStep) === 1 ? data.verbal : data.labeling_all),
          selectSpeaker: [],
        },
      ]);
      setTempLabelingList([]);
    } catch (err) {
      throw err;
    }
  }

  // 작업상태 변경
  async function jobUpdateStatus({
    workspaceId,
    projectId,
    jobId,
    workId,
    status,
    nextStatus,
    reason,
  }: {
    workspaceId: string;
    projectId: string;
    jobId: string;
    workId: string;
    status: string;
    nextStatus: string;
    reason?: string;
  }) {
    try {
      const url = '/work/updateStatus';
      const formData = {
        work_id: workId,
        workspace_id: workspaceId,
        project_id: projectId,
        job_id: jobId,
        work_status: status,
        next_work_status: nextStatus,
      } as {
        work_id: string;
        workspace_id: string;
        project_id: string;
        job_id: string;
        work_status: string;
        next_work_status: string;
        reason?: string;
      };
      if (reason) {
        formData.reason = reason;
      }
      const {
        data: { code, message, result },
      }: AxiosResponse<IApi> = await axios.put(url, formData);
      if (!result || code !== 'F000') {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 작업불가 사유 및 반려 사유 조회
  async function jobImpossibleList(workId: string, workStatus: string) {
    try {
      const queryData = {
        work_id: workId,
        work_status: workStatus,
      };
      const url = `/work/status/reason?${qs.stringify(queryData)}`;
      const {
        data: { code, message, result, data },
      }: AxiosResponse<IApi<IWorkerImpossibleList[]>> = await axios.get(url);
      if (!result || code !== 'F000') {
        throw { code, message };
      }
      setWorkerImpossibleList({
        list: data,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }

  // recoil상태 초기화
  function jobReset() {
    setWorkerJobList({
      list: [],
      selectJobId: null,
    });
    setWorkerJobFileList({
      videoList: [],
      audioList: [],
      selectVideoId: null,
      selectAudioId: null,
    });
    setWorkerJobFileVideo({
      fileId: '',
      fileOrgName: '',
      filePath: '',
      fileUrl: '',
      fileType: '',
    });
    setWorkerJobFileAudio({
      fileId: '',
      fileOrgName: '',
      filePath: '',
      fileUrl: '',
      fileType: '',
    });
    setWorkerLabelingData({
      meta: null,
      originalLabelingList: [],
      labelingList: [],
      speakers: [],
      verbalList: [],
      originalVerbalList: [],
      errorCheckList: [],
      selectLabeling: '',
      labelingInfoList: [],
      selectEditLabeling: '',
      viewerStep: 1,
      editCheck: false,
    });
    setWorkerLabelingCategoryData({
      affectiveList: null,
      channelList: null,
      sentimentList: null,
      fcIntentList: null,
      bcIntentList: null,
      emotionList: null,
      verbalVADList: null,
      overallVADList: null,
      paraverbalList: [],
      angleList: null,
      gSubjectList: null,
      gActionList: null,
      gObjectList: null,
      intentList: null,
      funcList: null,
      nonVerbalEmotionList: null,
      nonVerbalAffectiveList: null,
    });
    setProject({
      projectName: '',
      type: '',
    });
    setSection([]);
    setCurrentSection(null);
    setScrollWidth(0);
    setScrollLeft(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlay(false);
    setRepeat(false);
    setSeekingTime(0);
    setSpeed(1);
    setZoom(100);
    setHistoryLabelingList([]);
    setIsVerbalModal({
      open: false,
      top: 0,
      right: 130,
      type: 'verbal_vad',
      verbalId: '',
      title: '',
      data: null,
    });
  }

  return {
    workerProjectFind,
    jobList,
    jobFileList,
    jobFileVideo,
    jobFileAudio,
    jobLabeling,
    jobLabelingCategoryList,
    jobStart,
    jobStep1Temp,
    jobStep2Temp,
    jobStep3Temp,
    jobStep1,
    jobStep2,
    jobStep3,
    jobReset,
    jobUpdateStatus,
    jobImpossibleList,
  };
}

export { useWorkerActions };
