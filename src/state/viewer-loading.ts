import { atom, DefaultValue, selector } from 'recoil';

// loading atom

interface IViewerLoadingState {
  waveformReady: boolean;
  labelingReady: boolean;
}

const viewerLoadingAtom = atom<IViewerLoadingState>({
  key: 'viewerLoadingState',
  default: {
    waveformReady: false,
    labelingReady: false,
  },
});

// 파형과 라벨링 모두 준비됐을 때만 로딩 완료 (false 반환)
const viewerLoadingSelector = selector<boolean>({
  key: 'viewerLoadingSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    // true면 로딩 시작 (둘 다 false로)
    if (newValue === true) {
      set(viewerLoadingAtom, { waveformReady: false, labelingReady: false });
    }
  },
  get: ({ get }) => {
    const { waveformReady, labelingReady } = get(viewerLoadingAtom);
    // 둘 다 true여야 로딩 완료 (false 반환)
    return !(waveformReady && labelingReady);
  },
});

// 파형 준비 완료 selector
const viewerWaveformReadySelector = selector<boolean>({
  key: 'viewerWaveformReadySelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(viewerLoadingAtom, (prevState) => ({ ...prevState, waveformReady: newValue }));
  },
  get: ({ get }) => {
    const { waveformReady } = get(viewerLoadingAtom);
    return waveformReady;
  },
});

// 라벨링 준비 완료 selector
const viewerLabelingReadySelector = selector<boolean>({
  key: 'viewerLabelingReadySelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(viewerLoadingAtom, (prevState) => ({ ...prevState, labelingReady: newValue }));
  },
  get: ({ get }) => {
    const { labelingReady } = get(viewerLoadingAtom);
    return labelingReady;
  },
});

export { viewerLoadingAtom, viewerLoadingSelector, viewerWaveformReadySelector, viewerLabelingReadySelector };
