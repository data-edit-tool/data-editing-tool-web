import { atom } from 'recoil';

// 현재 재생여부를 저장하고 있는 atom을 선언합니다.
export const isPlayAtom = atom({
  key: 'IsPlayAtom',
  default: false,
});
