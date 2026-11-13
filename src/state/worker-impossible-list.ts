import { atom, selector } from 'recoil';
import { IWorkerImpossibleList } from 'types/worker-interface';

// 작업불가, 반려사유 리스트 atom

interface IWorkerImpossibleListState {
  list: IWorkerImpossibleList[];
}

const workerImpossibleListAtom = atom<IWorkerImpossibleListState>({
  key: 'workerImpossibleListState',
  default: {
    list: [],
  },
});

const workerImpossibleListSelector = selector<IWorkerImpossibleList[]>({
  key: 'workerImpossibleListSelector',
  get: ({ get }) => {
    const { list } = get(workerImpossibleListAtom);
    return list;
  },
});

export { workerImpossibleListAtom, workerImpossibleListSelector };
