// 반복재생여부를 판단하는 boolean 값을 가지는 atom
import { atom } from 'recoil';

export const repeatAtom = atom({
  key: 'RepeatAtom',
  default: false,
});

export const repeatAgainAtom = atom({
  key: 'RepeatAgainAtom',
  default: false,
});
