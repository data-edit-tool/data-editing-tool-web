import { atom, DefaultValue, selector } from 'recoil';
import { IHistoryLabelingAll } from 'types/worker-interface';

interface IWorkerLabelingHistoryListState {
  list: IHistoryLabelingAll[];
  index: number;
}

const workerLabelingHistoryListAtom = atom<IWorkerLabelingHistoryListState>({
  key: 'workerLabelingHistoryListState',
  default: {
    list: [],
    index: 1,
  },
});

const workerLabelingHistoryListSelector = selector<IHistoryLabelingAll[]>({
  key: 'workerLabelingHistoryListSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingHistoryListAtom, (prevState) => ({ ...prevState, list: newValue, index: newValue.length }));
  },
  get: ({ get }) => {
    const { list } = get(workerLabelingHistoryListAtom);
    return list;
  },
});

const workerLabelingHistoryIndexSelector = selector<number>({
  key: 'workerLabelingHistoryIndexSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingHistoryListAtom, (prevState) => ({ ...prevState, index: newValue }));
  },
  get: ({ get }) => {
    const { index } = get(workerLabelingHistoryListAtom);
    return index;
  },
});

export { workerLabelingHistoryListAtom, workerLabelingHistoryListSelector, workerLabelingHistoryIndexSelector };
