import { atom } from 'recoil';

interface IVerbal {
  open: boolean;
  top: number;
  right: number;
  type: 'verbal_vad' | 'overall_vad';
  verbalId: string;
  title: string;
  data: {
    valence: number;
    arousal: number;
    dominance: number;
  } | null;
}

// worker modal을 설정하는 atom 을 선언합니다.
export const workerModalAtom = atom<IVerbal>({
  key: 'VideoTimeAtom',
  default: {
    open: false,
    top: 0,
    right: 130,
    type: 'verbal_vad',
    verbalId: '',
    title: '',
    data: null,
  },
});
