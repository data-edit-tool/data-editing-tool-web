import { atom, DefaultValue, selector } from 'recoil';

// loading atom

interface IWorkerLoadingState {
  loading: boolean;
}

const workerLoadingAtom = atom<IWorkerLoadingState>({
  key: 'workerLoadingState',
  default: {
    loading: true,
  },
});

const workerLoadingSelector = selector<boolean>({
  key: 'workerLoadingSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLoadingAtom, (prevState) => ({ ...prevState, loading: newValue }));
  },
  get: ({ get }) => {
    const { loading } = get(workerLoadingAtom);
    return loading;
  },
});

export { workerLoadingAtom, workerLoadingSelector };
