import { AxiosResponse } from 'axios';
import { useSetRecoilState } from 'recoil';
import { userWorkspaceManagementAtom } from 'state/user-workspace-management';
import { IApi } from 'types/interface';
import { IUserWorkspaceManagementList } from 'types/user-workspace-management.interface';
import axios from 'utils/axios';

function useUserWorkspaceManagementActions() {
  const setUserWorkspaceManagement = useSetRecoilState(userWorkspaceManagementAtom);

  // 유저 워크스페이스 목록 조회
  async function list() {
    const url = `/workspace/list`;

    try {
      const {
        data: { result, code, data, message },
      }: AxiosResponse<IApi<IUserWorkspaceManagementList[]>> = await axios.get(url);
      if (result && code === 'F000') {
        setUserWorkspaceManagement((prevState) => ({
          ...prevState,
          isLoading: false,
          list: data,
        }));
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  return { list };
}

export { useUserWorkspaceManagementActions };
