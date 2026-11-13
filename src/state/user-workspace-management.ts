import { atom, selector } from 'recoil';
import { IUserWorkspaceManagementList } from 'types/user-workspace-management.interface';

interface IUserWorkspaceManagementState {
  isLoading: boolean;
  list: IUserWorkspaceManagementList[];
}

const userWorkspaceManagementAtom = atom<IUserWorkspaceManagementState>({
  key: 'userWorkspaceManagementState',
  default: {
    isLoading: true,
    list: [],
  },
});

const userWorkspaceManagementListSelector = selector<IUserWorkspaceManagementList[]>({
  key: 'userWorkspaceManagementListSelector',
  get: ({ get }) => {
    const { list } = get(userWorkspaceManagementAtom);
    return list;
  },
});

export { userWorkspaceManagementAtom, userWorkspaceManagementListSelector };
