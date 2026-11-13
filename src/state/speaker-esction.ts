import { atom } from 'recoil';

interface SectionData {
  startTime: number;
  endTime: number;
  label?: string;
}

// 영상의 재생속도를 조절하는 atom 을 선언합니다.
export const speakerSectionsAtom = atom<SectionData[]>({
  key: 'speakerSectionsAtom',
  default: [],
});
