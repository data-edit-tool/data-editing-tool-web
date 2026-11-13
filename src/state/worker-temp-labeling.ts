import { atom, DefaultValue, selector } from 'recoil';
import { ILabelingAll } from 'types/worker-interface';

interface IWorkerTempLabelingState {
  labelingList: ILabelingAll[];
}

const workerTempLabelingAtom = atom<IWorkerTempLabelingState>({
  key: 'workerTempLabelingState',
  default: {
    labelingList: [],
  },
});

const workerTempLabelingListSelector = selector<ILabelingAll[]>({
  key: 'workerTempLabelingListSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerTempLabelingAtom, (prevState) => ({ ...prevState, labelingList: newValue }));
  },
  get: ({ get }) => {
    const { labelingList } = get(workerTempLabelingAtom);
    return labelingList;
  },
});

export { workerTempLabelingAtom, workerTempLabelingListSelector };
