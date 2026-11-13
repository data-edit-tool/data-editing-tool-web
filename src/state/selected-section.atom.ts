import { atom } from 'recoil';

// click된 section을 저장하는 atom 을 선언한다.
export const selectedSectionAtom = atom<{ id: string; startTime: number; endTime: number }[]>({
  key: 'SelectedSectionAtom',
  default: [],
});
