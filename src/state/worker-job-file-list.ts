import { atom, DefaultValue, selector } from 'recoil';
import { IJobFileList } from 'types/worker-interface';

// 오디오, 비디오 리스트 atom

interface IWorkerJobFileListState {
  videoList: IJobFileList[];
  audioList: IJobFileList[];
  selectVideoId: IJobFileList | null;
  selectAudioId: IJobFileList | null;
}

const workerJobFileListAtom = atom<IWorkerJobFileListState>({
  key: 'workerJobFileListState',
  default: {
    videoList: [],
    audioList: [],
    selectVideoId: null,
    selectAudioId: null,
  },
});

const workerJobFileVideoListSelector = selector<IJobFileList[]>({
  key: 'workerJobFileVideoListSelector',
  get: ({ get }) => {
    const { videoList } = get(workerJobFileListAtom);
    return videoList;
  },
});

const workerJobFileAudioListSelector = selector<IJobFileList[]>({
  key: 'workerJobFileAudioListSelector',
  get: ({ get }) => {
    const { audioList } = get(workerJobFileListAtom);
    return audioList;
  },
});

const workerJobFileSelectVideoIdSelector = selector<IJobFileList | null>({
  key: 'workerSelectVideoIdSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerJobFileListAtom, (prevState) => ({ ...prevState, selectVideoId: newValue }));
  },
  get: ({ get }) => {
    const { selectVideoId } = get(workerJobFileListAtom);
    return selectVideoId;
  },
});

const workerJobFileSelectAudioIdSelector = selector<IJobFileList | null>({
  key: 'workerSelectAudioIdSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerJobFileListAtom, (prevState) => ({ ...prevState, selectAudioId: newValue }));
  },
  get: ({ get }) => {
    const { selectAudioId } = get(workerJobFileListAtom);
    return selectAudioId;
  },
});

export {
  workerJobFileListAtom,
  workerJobFileVideoListSelector,
  workerJobFileAudioListSelector,
  workerJobFileSelectVideoIdSelector,
  workerJobFileSelectAudioIdSelector,
};
