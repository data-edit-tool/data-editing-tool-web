import { atom, selector } from 'recoil';

// project 정보 atom

interface IWorkerProjectState {
  projectName: string;
  type: 'W' | 'C' | 'V' | '';
}

const workerProjectAtom = atom<IWorkerProjectState>({
  key: 'workerProjectState',
  default: {
    projectName: '',
    type: '',
  },
});

const workerProjectSelector = selector<string>({
  key: 'workerProjectSelector',
  get: ({ get }) => {
    const { projectName } = get(workerProjectAtom);
    return projectName;
  },
});

const workerTypeSelector = selector<'W' | 'C' | 'V' | ''>({
  key: 'workerUserTypeSelector',
  get: ({ get }) => {
    const { type } = get(workerProjectAtom);
    return type;
  },
});

export { workerProjectAtom, workerProjectSelector, workerTypeSelector };
