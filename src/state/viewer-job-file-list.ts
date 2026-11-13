import { atom, DefaultValue, selector } from 'recoil';
import { IJobFileList } from 'types/worker-interface';

// 오디오, 비디오 리스트 atom

interface IViewerJobFileListState {
  videoList: IJobFileList[];
  audioList: IJobFileList[];
  selectVideoId: IJobFileList | null;
  selectAudioId: IJobFileList | null;
}

const viewerJobFileListAtom = atom<IViewerJobFileListState>({
  key: 'viewerJobFileListState',
  default: {
    videoList: [],
    audioList: [],
    selectVideoId: null,
    selectAudioId: null,
  },
});

const viewerJobFileVideoListSelector = selector<IJobFileList[]>({
  key: 'viewerJobFileVideoListSelector',
  get: ({ get }) => {
    const { videoList } = get(viewerJobFileListAtom);
    return videoList;
  },
});

const viewerJobFileAudioListSelector = selector<IJobFileList[]>({
  key: 'viewerJobFileAudioListSelector',
  get: ({ get }) => {
    const { audioList } = get(viewerJobFileListAtom);
    return audioList;
  },
});

const viewerJobFileSelectVideoIdSelector = selector<IJobFileList | null>({
  key: 'viewerSelectVideoIdSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(viewerJobFileListAtom, (prevState) => ({ ...prevState, selectVideoId: newValue }));
  },
  get: ({ get }) => {
    const { selectVideoId } = get(viewerJobFileListAtom);
    return selectVideoId;
  },
});

const viewerJobFileSelectAudioIdSelector = selector<IJobFileList | null>({
  key: 'viewerSelectAudioIdSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(viewerJobFileListAtom, (prevState) => ({ ...prevState, selectAudioId: newValue }));
  },
  get: ({ get }) => {
    const { selectAudioId } = get(viewerJobFileListAtom);
    return selectAudioId;
  },
});

export {
  viewerJobFileListAtom,
  viewerJobFileVideoListSelector,
  viewerJobFileAudioListSelector,
  viewerJobFileSelectVideoIdSelector,
  viewerJobFileSelectAudioIdSelector,
};
