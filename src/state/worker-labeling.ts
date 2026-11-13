import { atom, DefaultValue, selector } from 'recoil';
import { IJobStartFormLabeling, ILabelingAll, ILabelingInfoList, ILabelingMeta, ILabelingSpeakers } from 'types/worker-interface';
import { isVerbalParing } from 'utils/labeling-parsing';

// verbal, paranoral, nonverbal atom

interface IWorkerLabelingState {
  meta: ILabelingMeta | null;
  originalLabelingList: ILabelingAll[];
  labelingList: ILabelingAll[];
  verbalList: ILabelingAll[];
  originalVerbalList: ILabelingAll[];
  speakers: ILabelingSpeakers[];
  labelingInfoList: ILabelingInfoList[];
  errorCheckList: string[];
  selectLabeling: string;
  selectEditLabeling: string;
  viewerStep: number;
  editCheck: boolean;
}

const workerLabelingAtom = atom<IWorkerLabelingState>({
  key: 'workerLabelingState',
  default: {
    meta: null,
    originalLabelingList: [],
    labelingList: [],
    verbalList: [],
    originalVerbalList: [],
    speakers: [],
    labelingInfoList: [],
    errorCheckList: [],
    selectLabeling: '',
    selectEditLabeling: '',
    viewerStep: 1,
    editCheck: false,
  },
});

const workerLabelingMetaSelector = selector<ILabelingMeta | null>({
  key: 'workerLabelingMetaSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, meta: newValue }));
  },
  get: ({ get }) => {
    const { meta } = get(workerLabelingAtom);
    return meta;
  },
});

const workerLabelingListSelector = selector<ILabelingAll[]>({
  key: 'workerLabelingListSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, labelingList: newValue }));
  },
  get: ({ get }) => {
    const { labelingList } = get(workerLabelingAtom);
    const paringLabelingList = [...labelingList].sort((a, b) => a.start_time - b.start_time);
    return paringLabelingList;
  },
});

const workerOriginalLabelingListSelector = selector<ILabelingAll[]>({
  key: 'workerOriginalLabelingListSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, originalLabelingList: newValue }));
  },
  get: ({ get }) => {
    const { originalLabelingList } = get(workerLabelingAtom);
    const paringLabelingList = [...originalLabelingList].sort((a, b) => a.start_time - b.start_time);
    return paringLabelingList;
  },
});

const workerLabelingSpeakersLabelingListSelector = selector<IJobStartFormLabeling[]>({
  key: 'workerLabelingSpeakersLabelingListSelector',
  get: ({ get }) => {
    const { labelingList, labelingInfoList } = get(workerLabelingAtom);
    const paringLabelingList = isVerbalParing(labelingList, labelingInfoList);

    return paringLabelingList;
  },
});

const workerLabelingInfoListSelector = selector<ILabelingInfoList[]>({
  key: 'workerLabelingInfoListSelector',
  get: ({ get }) => {
    const { labelingInfoList } = get(workerLabelingAtom);
    return labelingInfoList;
  },
});

const workerLabelingVerbalResizeListSelector = selector<ILabelingAll[]>({
  key: 'workerLabelingVerbalResizeListSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, verbalList: newValue }));
  },
  get: ({ get }) => {
    const { verbalList } = get(workerLabelingAtom);

    return verbalList;
  },
});

const workerLabelingVerbalOriginalListSelector = selector<ILabelingAll[]>({
  key: 'workerLabelingVerbalOriginalListSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, originalVerbalList: newValue }));
  },
  get: ({ get }) => {
    const { originalVerbalList } = get(workerLabelingAtom);

    return originalVerbalList;
  },
});

const workerLabelingVerbalListSelector = selector<IJobStartFormLabeling[]>({
  key: 'workerLabelingVerbalListSelector',
  get: ({ get }) => {
    const { verbalList, labelingInfoList } = get(workerLabelingAtom);
    const paringLabelingList = isVerbalParing(verbalList, labelingInfoList);

    return paringLabelingList;
  },
});

const workerLabelingSpeakersSelector = selector<ILabelingSpeakers[]>({
  key: 'workerLabelingSpeakersSelector',
  get: ({ get }) => {
    const { speakers } = get(workerLabelingAtom);
    const sortSpeakerList = [...speakers].sort((a, b) => a.speaker_id.localeCompare(b.speaker_id));
    return sortSpeakerList;
  },
});

const workerLabelingErrorCheckListSelector = selector<string[]>({
  key: 'workerLabelingErrorCheckListSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, errorCheckList: newValue }));
  },
  get: ({ get }) => {
    const { errorCheckList } = get(workerLabelingAtom);
    return errorCheckList;
  },
});

// const workerLabelingSelectLabelingSelector = selector<string>({
//   key: 'workerLabelingSelectLabelingSelector',
//   set: ({ set }, newValue) => {
//     if (newValue instanceof DefaultValue) {
//       return;
//     }
//     set(workerLabelingAtom, (prevState) => ({ ...prevState, selectLabeling: newValue }));
//   },
//   get: ({ get }) => {
//     const { selectLabeling } = get(workerLabelingAtom);
//     return selectLabeling;
//   },
// });

const workerLabelingSelectEditLabelingSelector = selector<string>({
  key: 'workerLabelingSelectEditLabelingSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, selectEditLabeling: newValue }));
  },
  get: ({ get }) => {
    const { selectEditLabeling } = get(workerLabelingAtom);
    return selectEditLabeling;
  },
});

const workerLabelingViewerStepSelector = selector<number>({
  key: 'workerLabelingViewerStepSelector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, viewerStep: newValue }));
  },
  get: ({ get }) => {
    const { viewerStep } = get(workerLabelingAtom);
    return viewerStep;
  },
});

const workerLabelingEditCheckSelector = selector<boolean>({
  key: 'workerLabelingEditCheck',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      return;
    }
    set(workerLabelingAtom, (prevState) => ({ ...prevState, editCheck: newValue }));
  },
  get: ({ get }) => {
    const { editCheck } = get(workerLabelingAtom);
    return editCheck;
  },
});

export {
  workerLabelingAtom,
  workerLabelingMetaSelector,
  workerLabelingListSelector,
  workerLabelingSpeakersSelector,
  workerLabelingSpeakersLabelingListSelector,
  workerLabelingErrorCheckListSelector,
  workerLabelingVerbalListSelector,
  workerLabelingVerbalOriginalListSelector,
  workerLabelingInfoListSelector,
  workerLabelingSelectEditLabelingSelector,
  workerOriginalLabelingListSelector,
  workerLabelingViewerStepSelector,
  workerLabelingEditCheckSelector,
  workerLabelingVerbalResizeListSelector,
};
