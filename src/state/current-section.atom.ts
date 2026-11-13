import { atom } from 'recoil';

export const currentSectionAtom = atom<{ id: string; startTime: number; endTime: number } | null>({
  key: 'CurrentSectionAtom',
  default: null,
});
