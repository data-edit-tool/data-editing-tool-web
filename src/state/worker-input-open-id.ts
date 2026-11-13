import { atom, DefaultValue, selector } from 'recoil';

// input open atom

interface IWorkerInputOpenIdState {
  isInputOpenId: string;
}

const workerInputOpenIdAtom = atom<IWorkerInputOpenIdState>({
  key: 'workerInputOpenIdState',
  default: {
    isInputOpenId: '',
  },
});

const workerInputOpenIdSelector = selector<string>({
  key: 'workerInputOpenIdSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerInputOpenIdAtom, (prevState) => ({ ...prevState, isInputOpenId: newValue }));
  },
  get: ({ get }) => {
    const { isInputOpenId } = get(workerInputOpenIdAtom);
    return isInputOpenId;
  },
});

export { workerInputOpenIdAtom, workerInputOpenIdSelector };
