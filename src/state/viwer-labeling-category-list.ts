import { atom, selector } from 'recoil';
import { IJobCategoryListDepth, IJobLabelingCategory } from 'types/worker-interface';

// worker 라벨링 카테고리 atom

interface IViewerLabelingCategoryState {
  affectiveList: IJobLabelingCategory | null;
  channelList: IJobLabelingCategory | null;
  sentimentList: IJobLabelingCategory | null;
  fcIntentList: IJobLabelingCategory | null;
  bcIntentList: IJobLabelingCategory | null;
  emotionList: IJobLabelingCategory | null;
  verbalVADList: IJobLabelingCategory | null;
  overallVADList: IJobLabelingCategory | null;
  paraverbalList: IJobCategoryListDepth[];
  angleList: IJobCategoryListDepth | null;
  gSubjectList: IJobCategoryListDepth | null;
  gActionList: IJobCategoryListDepth | null;
  gObjectList: IJobCategoryListDepth | null;
  intentList: IJobCategoryListDepth | null;
  funcList: IJobCategoryListDepth | null;
  nonVerbalEmotionList: IJobCategoryListDepth | null;
  nonVerbalAffectiveList: IJobCategoryListDepth | null;
}

const viewerLabelingCategoryAtom = atom<IViewerLabelingCategoryState>({
  key: 'viewerLabelingCategoryState',
  default: {
    affectiveList: null,
    channelList: null,
    sentimentList: null,
    bcIntentList: null,
    fcIntentList: null,
    emotionList: null,
    verbalVADList: null,
    overallVADList: null,
    paraverbalList: [],
    angleList: null,
    gSubjectList: null,
    gActionList: null,
    gObjectList: null,
    intentList: null,
    funcList: null,
    nonVerbalEmotionList: null,
    nonVerbalAffectiveList: null,
  },
});

const viewerLabelingAffectiveSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingAffectiveSelector',
  get: ({ get }) => {
    const { affectiveList } = get(viewerLabelingCategoryAtom);
    return affectiveList?.ctg_depth || [];
  },
});

const viewerLabelingChannelSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingChannelSelector',
  get: ({ get }) => {
    const { channelList } = get(viewerLabelingCategoryAtom);
    return channelList?.ctg_depth || [];
  },
});

const viewerLabelingSentimentSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingSentimentSelector',
  get: ({ get }) => {
    const { sentimentList } = get(viewerLabelingCategoryAtom);
    return sentimentList?.ctg_depth || [];
  },
});

const viewerLabelingBcIntentSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingBcIntentSelector',
  get: ({ get }) => {
    const { bcIntentList } = get(viewerLabelingCategoryAtom);
    return bcIntentList?.ctg_depth || [];
  },
});

const viewerLabelingFcIntentSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingFcIntentSelector',
  get: ({ get }) => {
    const { fcIntentList } = get(viewerLabelingCategoryAtom);
    return fcIntentList?.ctg_depth || [];
  },
});

const viewerLabelingEmotionSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingEmotionSelector',
  get: ({ get }) => {
    const { emotionList } = get(viewerLabelingCategoryAtom);
    return emotionList?.ctg_depth || [];
  },
});

const viewerLabelingVerbalVADSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingVerbalVADSelector',
  get: ({ get }) => {
    const { verbalVADList } = get(viewerLabelingCategoryAtom);
    return verbalVADList?.ctg_depth || [];
  },
});

const viewerLabelingOverallVADSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingOverallVADSelector',
  get: ({ get }) => {
    const { overallVADList } = get(viewerLabelingCategoryAtom);
    return overallVADList?.ctg_depth || [];
  },
});

const viewerLabelingParaverbalSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingParaverbalSelector',
  get: ({ get }) => {
    const { paraverbalList } = get(viewerLabelingCategoryAtom);
    return paraverbalList;
  },
});

const viewerLabelingAngleSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingAngleSelector',
  get: ({ get }) => {
    const { angleList } = get(viewerLabelingCategoryAtom);
    return angleList?.ctg_depth || [];
  },
});

const viewerLabelingGSubjectSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingGSubjectSelector',
  get: ({ get }) => {
    const { gSubjectList } = get(viewerLabelingCategoryAtom);
    return gSubjectList?.ctg_depth || [];
  },
});

const viewerLabelingGActionSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingGActionSelector',
  get: ({ get }) => {
    const { gActionList } = get(viewerLabelingCategoryAtom);
    return gActionList?.ctg_depth || [];
  },
});

const viewerLabelingGObjectSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingGObjectSelector',
  get: ({ get }) => {
    const { gObjectList } = get(viewerLabelingCategoryAtom);
    return gObjectList?.ctg_depth || [];
  },
});

const viewerLabelingIntentSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingIntentSelector',
  get: ({ get }) => {
    const { intentList } = get(viewerLabelingCategoryAtom);
    return intentList?.ctg_depth || [];
  },
});

const viewerLabelingFuncSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingFuncSelector',
  get: ({ get }) => {
    const { funcList } = get(viewerLabelingCategoryAtom);
    return funcList?.ctg_depth || [];
  },
});

const viewerLabelingNonVerbalEmotionSelector = selector<IJobCategoryListDepth[]>({
  key: 'viewerLabelingNonVerbalEmotionSelector',
  get: ({ get }) => {
    const { nonVerbalEmotionList } = get(viewerLabelingCategoryAtom);
    return nonVerbalEmotionList?.ctg_depth || [];
  },
});

export {
  viewerLabelingCategoryAtom,
  viewerLabelingAffectiveSelector,
  viewerLabelingChannelSelector,
  viewerLabelingSentimentSelector,
  viewerLabelingBcIntentSelector,
  viewerLabelingFcIntentSelector,
  viewerLabelingEmotionSelector,
  viewerLabelingVerbalVADSelector,
  viewerLabelingOverallVADSelector,
  viewerLabelingParaverbalSelector,
  viewerLabelingAngleSelector,
  viewerLabelingGSubjectSelector,
  viewerLabelingGActionSelector,
  viewerLabelingGObjectSelector,
  viewerLabelingIntentSelector,
  viewerLabelingFuncSelector,
  viewerLabelingNonVerbalEmotionSelector,
};
