import { atom } from 'recoil';

// 영상의 재생속도를 조절하는 atom 을 선언합니다.
export const speedAtom = atom({
  key: 'SpeedAtom',
  default: 1,
});
