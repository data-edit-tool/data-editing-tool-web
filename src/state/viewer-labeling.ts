import { atom, DefaultValue, selector } from 'recoil';
import { ILabelingAll, ILabelingSpeakers, IVoiceMeasurements } from 'types/worker-interface';

interface IViewerLabelingState {
  list: {
    verbalList: ILabelingAll[];
    paraverbalList: ILabelingAll[];
    nonVerbalList: ILabelingAll[];
    speakers: ILabelingSpeakers;
    voice_measurements: IVoiceMeasurements[];
  }[];
  verbalList: ILabelingAll[];
}

const viewerLabelingAtom = atom<IViewerLabelingState>({
  key: 'viewerLabelingState',
  default: {
    list: [],
    verbalList: [],
  },
});

const viewerVerbalListSelector = selector<ILabelingAll[]>({
  key: 'viewerVerbalListSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(viewerLabelingAtom, (prevState) => ({ ...prevState, verbalList: newValue }));
  },
  get: ({ get }) => {
    const { verbalList } = get(viewerLabelingAtom);
    return verbalList.flat();
  },
});

const viewerLabelingListSelector = selector<IViewerLabelingState['list']>({
  key: 'viewerLabelingListSelector',
  get: ({ get }) => {
    const { list } = get(viewerLabelingAtom);
    return list;
  },
});

export { viewerLabelingAtom, viewerLabelingListSelector, viewerVerbalListSelector };
