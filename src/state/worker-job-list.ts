import { atom, DefaultValue, selector } from 'recoil';
import { IJobList } from 'types/worker-interface';

// 작업파일 atom

interface IWorkerJobListState {
  list: IJobList[];
  selectJobId: IJobList | null;
}

const workerJobListAtom = atom<IWorkerJobListState>({
  key: 'workerJobListState',
  default: {
    list: [],
    selectJobId: null,
  },
});

const workerJobListSelector = selector<IJobList[]>({
  key: 'workerJobListSelector',
  get: ({ get }) => {
    const { list } = get(workerJobListAtom);
    return list;
  },
});

const workerSelectJobIdSelector = selector<IJobList | null>({
  key: 'workerSelectJobIdSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerJobListAtom, (prevState) => ({ ...prevState, selectJobId: newValue }));
  },
  get: ({ get }) => {
    const { selectJobId } = get(workerJobListAtom);
    return selectJobId;
  },
});

export { workerJobListAtom, workerJobListSelector, workerSelectJobIdSelector };
