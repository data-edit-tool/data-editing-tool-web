import { atom } from 'recoil';
// scrollLeft atom
export const scrollLeftAtom = atom<number>({
  key: 'scrollLeftAtom',
  default: 0,
});
