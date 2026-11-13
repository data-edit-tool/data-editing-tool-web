import { atom, DefaultValue, selector } from 'recoil';
import { IJobList } from 'types/worker-interface';

// 작업파일 atom

interface IViewerJobListState {
  list: IJobList[];
  selectJobId: IJobList | null;
}

const viewerJobListAtom = atom<IViewerJobListState>({
  key: 'viewerJobListState',
  default: {
    list: [],
    selectJobId: null,
  },
});

const viewerJobListSelector = selector<IJobList[]>({
  key: 'viewerJobListSelector',
  get: ({ get }) => {
    const { list } = get(viewerJobListAtom);
    return list;
  },
});

const viewerSelectJobIdSelector = selector<IJobList | null>({
  key: 'viewerSelectJobIdSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(viewerJobListAtom, (prevState) => ({ ...prevState, selectJobId: newValue }));
  },
  get: ({ get }) => {
    const { selectJobId } = get(viewerJobListAtom);
    return selectJobId;
  },
});

export { viewerJobListAtom, viewerJobListSelector, viewerSelectJobIdSelector };
