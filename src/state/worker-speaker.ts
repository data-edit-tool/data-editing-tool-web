import { atom, DefaultValue, selector } from 'recoil';

// speaker atom

interface IWorkerSpeakerState {
  selectSpeaker: string[];
}

const workerSpeakerAtom = atom<IWorkerSpeakerState>({
  key: 'workerSpeakerState',
  default: {
    selectSpeaker: [],
  },
});

const workerSpeakerSelector = selector<string[]>({
  key: 'workerSpeakerSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerSpeakerAtom, (prevState) => ({ ...prevState, selectSpeaker: newValue }));
  },
  get: ({ get }) => {
    const { selectSpeaker } = get(workerSpeakerAtom);
    return selectSpeaker;
  },
});

export { workerSpeakerAtom, workerSpeakerSelector };
