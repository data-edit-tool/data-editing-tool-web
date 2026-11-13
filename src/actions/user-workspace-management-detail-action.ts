import { AxiosResponse } from 'axios';
import { useSetRecoilState } from 'recoil';
import { userWorkspaceManagementAvailableAtom } from 'state/user-workspace-managment-detail';
import { IApi } from 'types/interface';
import { IUserWorkspaceManagementDetail, IUserWorkspaceManagementGuide } from 'types/user-workspace-management-detail.interface';
import axios from 'utils/axios';

function useUserWorkspaceManagementDetailActions() {
  const setUserWorkspaceManagementAvailable = useSetRecoilState(userWorkspaceManagementAvailableAtom);

  // 유저 프로젝트 목록 조회
  async function list(workspaceId: string) {
    const url = `/workspace/find?workspace_id=${workspaceId}`;

    try {
      const {
        data: { result, code, data, message },
      }: AxiosResponse<IApi<IUserWorkspaceManagementDetail>> = await axios.get(url);
      if (result && code === 'F000') {
        setUserWorkspaceManagementAvailable((prevState) => ({
          ...prevState,
          isLoading: false,
          workspaceName: data.workspace_name,
          isViewer: data.is_viewer,
          progressList: data.all_projects_by_user_id || [],
          availableList: data.all_projects || [],
        }));
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 가이드 파일 다운로드
  async function guideDownload(workspaceId: string) {
    const url = `/workspace/guide/list?workspace_id=${workspaceId}`;
    try {
      const {
        data: { result, code, message, data },
      }: AxiosResponse<IApi<IUserWorkspaceManagementGuide>> = await axios.get(url);
      if (result && code === 'F000') {
        return data.guides;
      }
      throw { code, message };
    } catch (err) {
      throw err;
    }
  }

  return { list, guideDownload };
}

export { useUserWorkspaceManagementDetailActions };
