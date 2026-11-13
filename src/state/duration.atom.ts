// duration을 표시하는 atom

import { atom } from 'recoil';

const durationAtom = atom({
  key: 'durationAtom',
  default: 0,
});

export default durationAtom;
