import { atom } from 'recoil';

/** 현재 영상 재생시간을 ms 단위로 보여주는 아톰을 작성합니다. */
export const timeAtom = atom({
  key: 'TimeAtom',
  default: 0,
});
