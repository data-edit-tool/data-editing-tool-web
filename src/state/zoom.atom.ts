import { atom } from 'recoil';

// zoom atom

export const zoomAtom = atom<number>({
  key: 'ZoomAtom',
  default: 100,
});
