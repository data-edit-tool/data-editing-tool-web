import { atom, selector } from 'recoil';
import { IUserWorkspaceManagementAvailableList } from 'types/user-workspace-management-detail.interface';

// 프로젝트 리스트 atom

interface IUserWorkspaceManagementAvailableState {
  isLoading: boolean;
  workspaceName: string;
  isViewer: boolean;
  progressList: IUserWorkspaceManagementAvailableList[];
  availableList: IUserWorkspaceManagementAvailableList[];
}

const userWorkspaceManagementAvailableAtom = atom<IUserWorkspaceManagementAvailableState>({
  key: 'userWorkspaceAvailableManagementState',
  default: {
    isLoading: true,
    workspaceName: '',
    isViewer: false,
    progressList: [],
    availableList: [],
  },
});

const userWorkspaceManagementNameSelector = selector<string>({
  key: 'userWorkspaceManagementNameSelector',
  get: ({ get }) => {
    const { workspaceName } = get(userWorkspaceManagementAvailableAtom);
    return workspaceName;
  },
});

const userWorkspaceManagementProgressListSelector = selector<IUserWorkspaceManagementAvailableList[]>({
  key: 'userWorkspaceProgressManagementListSelector',
  get: ({ get }) => {
    const { progressList } = get(userWorkspaceManagementAvailableAtom);
    return progressList;
  },
});

const userWorkspaceManagementAvailableListSelector = selector<IUserWorkspaceManagementAvailableList[]>({
  key: 'userWorkspaceAvailableManagementListSelector',
  get: ({ get }) => {
    const { availableList } = get(userWorkspaceManagementAvailableAtom);
    return availableList;
  },
});

const userWorkspaceManagementIsViewerSelector = selector<boolean>({
  key: 'userWorkspaceManagementIsViewerSelector',
  get: ({ get }) => {
    const { isViewer } = get(userWorkspaceManagementAvailableAtom);
    return isViewer;
  },
});

export {
  userWorkspaceManagementAvailableAtom,
  userWorkspaceManagementNameSelector,
  userWorkspaceManagementProgressListSelector,
  userWorkspaceManagementAvailableListSelector,
  userWorkspaceManagementIsViewerSelector,
};
