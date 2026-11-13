import { atom } from 'recoil';

// video time을 설정하는 atom 을 선언합니다.
export const videoTimeAtom = atom({
  key: 'VideoTimeAtom',
  default: 0,
});
