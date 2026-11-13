import { atom, selector } from 'recoil';

interface IViewerProjectState {
  projectName: string;
}

const viewerProjectAtom = atom<IViewerProjectState>({
  key: 'viewerProjectState',
  default: {
    projectName: '',
  },
});

const viewerProjectSelector = selector<string>({
  key: 'viewerProjectSelector',
  get: ({ get }) => {
    const { projectName } = get(viewerProjectAtom);
    return projectName;
  },
});

export { viewerProjectAtom, viewerProjectSelector };
