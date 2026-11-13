import { AxiosResponse } from 'axios';
import qs from 'qs';
import { useSetRecoilState } from 'recoil';
import { viewerJobFileListAtom } from 'state/viewer-job-file-list';
import { viewerJobListAtom } from 'state/viewer-job-list';
import { viewerLabelingAtom } from 'state/viewer-labeling';
import { viewerLabelingReadySelector } from 'state/viewer-loading';
import { viewerProjectAtom } from 'state/viewer-project';
import { viewerLabelingCategoryAtom } from 'state/viwer-labeling-category-list';
import { IApi } from 'types/interface';
import { IJobFileList, IJobLabelingCategory, IJobListData, IViewerLabelingData, IWorkerProject } from 'types/worker-interface';
import axios from 'utils/axios';

function useViewerActions() {
  const setProject = useSetRecoilState(viewerProjectAtom);
  const setViewerJobListState = useSetRecoilState(viewerJobListAtom);
  const setViewerLabelingData = useSetRecoilState(viewerLabelingAtom);
  const setViewerJobFileList = useSetRecoilState(viewerJobFileListAtom);
  const setViewerLabelingCategoryData = useSetRecoilState(viewerLabelingCategoryAtom);
  const setLabelingReady = useSetRecoilState(viewerLabelingReadySelector);

  async function viewerProjectFind(workspaceId: string, projectId: string) {
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
        if (data.user_type === 'V') {
          setProject({
            projectName: data.project_name,
          });
        } else {
          throw { code, message };
        }
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 작업할 파일 리스트 조회
  async function viewerJobList(workspaceId: string, projectId: string) {
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
        const targetIdx = data.target_idx;
        setViewerJobListState({
          list: data.list,
          selectJobId: data.list[targetIdx],
        });
        return data.list[targetIdx];
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 해당 작업파일에 오디오, 비디오 리스트
  async function viewerJobFileList(jobId: string) {
    try {
      const url = `/job/file/list?job_id=${jobId}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IJobFileList[]>> = await axios.get(url);
      if (result && code === 'F000') {
        const videoList = data.filter((item) => item.file_type === 'VIDEO');
        const audioList = data.filter((item) => item.file_type === 'AUDIO');
        const selectAudioId = audioList.length ? audioList[0] : null;
        const selectVideoId = videoList.length ? videoList[0] : null;
        setViewerJobFileList({
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

  async function viewerJobLabelingCategoryList(projectId: string, categoryName: 'verbal' | 'paraverbal' | 'nonverbal') {
    try {
      const url = `/category/find?project_id=${projectId}&ctg_name=${categoryName}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IJobLabelingCategory[]>> = await axios.get(url);
      if (result && code === 'F000') {
        if (categoryName === 'verbal') {
          setViewerLabelingCategoryData((prev) => ({
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
        } else if (categoryName === 'paraverbal') {
          setViewerLabelingCategoryData((prev) => ({
            ...prev,
            paraverbalList: data,
          }));
        } else if (categoryName === 'nonverbal') {
          setViewerLabelingCategoryData((prev) => ({
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
      throw err;
    }
  }

  async function viewerLabeling(projectId: string, jobId: string) {
    try {
      const url = `/job/viewer?project_id=${projectId}&job_id=${jobId}`;
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IViewerLabelingData[]>> = await axios.get(url);
      if (result && code === 'F000') {
        setViewerLabelingData({
          list: data.map((item) => {
            return {
              verbalList: item.verbals,
              paraverbalList: item.paraverbals,
              nonVerbalList: item.nonverbals,
              speakers: item.speaker,
              voice_measurements: item.voice_measurements,
            };
          }),
          verbalList: data.flatMap((item) => item.verbals).sort((a, b) => a.start_time - b.start_time),
        });
        setLabelingReady(true);
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  return {
    viewerProjectFind,
    viewerJobList,
    viewerJobFileList,
    viewerJobLabelingCategoryList,
    viewerLabeling,
  };
}

export default useViewerActions;
