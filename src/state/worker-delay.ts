import { atom } from 'recoil';

/** 실행취소할때 쓰는 delay */
export const delayAtom = atom({
  key: 'DelayAtom',
  default: false,
});
