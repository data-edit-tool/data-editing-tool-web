import { atom } from 'recoil';

// Indicates that auto selection should stay disabled until the user makes a new selection.
export const sectionAutoSelectBlockAtom = atom<boolean>({
  key: 'SectionAutoSelectBlockAtom',
  default: false,
});
