import { atom, selector } from 'recoil';
import { IJobCategoryListDepth, IJobLabelingCategory } from 'types/worker-interface';

// worker 라벨링 카테고리 atom

interface IWorkerLabelingCategoryState {
  affectiveList: IJobLabelingCategory | null;
  channelList: IJobLabelingCategory | null;
  sentimentList: IJobLabelingCategory | null;
  fcIntentList: IJobLabelingCategory | null;
  bcIntentList: IJobLabelingCategory | null;
  emotionList: IJobLabelingCategory | null;
  verbalVADList: IJobLabelingCategory | null;
  overallVADList: IJobLabelingCategory | null;
  paraverbalList: IJobLabelingCategory[];
  angleList: IJobLabelingCategory | null;
  gSubjectList: IJobLabelingCategory | null;
  gActionList: IJobLabelingCategory | null;
  gObjectList: IJobLabelingCategory | null;
  intentList: IJobLabelingCategory | null;
  funcList: IJobLabelingCategory | null;
  nonVerbalEmotionList: IJobLabelingCategory | null;
  nonVerbalAffectiveList: IJobLabelingCategory | null;
}

const workerLabelingCategoryAtom = atom<IWorkerLabelingCategoryState>({
  key: 'workerLabelingCategoryState',
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

const workerLabelingAffectiveSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingAffectiveSelector',
  get: ({ get }) => {
    const { affectiveList } = get(workerLabelingCategoryAtom);
    return affectiveList?.ctg_depth || [];
  },
});

const workerLabelingChannelSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingChannelSelector',
  get: ({ get }) => {
    const { channelList } = get(workerLabelingCategoryAtom);
    return channelList?.ctg_depth || [];
  },
});

const workerLabelingSentimentSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingSentimentSelector',
  get: ({ get }) => {
    const { sentimentList } = get(workerLabelingCategoryAtom);
    return sentimentList?.ctg_depth || [];
  },
});

const workerLabelingBcIntentSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingBcIntentSelector',
  get: ({ get }) => {
    const { bcIntentList } = get(workerLabelingCategoryAtom);
    return bcIntentList?.ctg_depth || [];
  },
});

const workerLabelingFcIntentSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingFcIntentSelector',
  get: ({ get }) => {
    const { fcIntentList } = get(workerLabelingCategoryAtom);
    return fcIntentList?.ctg_depth || [];
  },
});

const workerLabelingEmotionSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingEmotionSelector',
  get: ({ get }) => {
    const { emotionList } = get(workerLabelingCategoryAtom);
    return emotionList?.ctg_depth || [];
  },
});

const workerLabelingVerbalVADSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingVerbalVADSelector',
  get: ({ get }) => {
    const { verbalVADList } = get(workerLabelingCategoryAtom);
    return verbalVADList?.ctg_depth || [];
  },
});

const workerLabelingOverallVADSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingOverallVADSelector',
  get: ({ get }) => {
    const { overallVADList } = get(workerLabelingCategoryAtom);
    return overallVADList?.ctg_depth || [];
  },
});

const workerLabelingParaverbalSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingParaverbalSelector',
  get: ({ get }) => {
    const { paraverbalList } = get(workerLabelingCategoryAtom);
    return paraverbalList;
  },
});

const workerLabelingAngleSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingAngleSelector',
  get: ({ get }) => {
    const { angleList } = get(workerLabelingCategoryAtom);
    return angleList?.ctg_depth || [];
  },
});

const workerLabelingGSubjectSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingGSubjectSelector',
  get: ({ get }) => {
    const { gSubjectList } = get(workerLabelingCategoryAtom);
    return gSubjectList?.ctg_depth || [];
  },
});

const workerLabelingGActionSelector = selector<
  {
    ctg_id: string;
    ctg_name: string;
    ctg_parent_id: string;
  }[]
>({
  key: 'workerLabelingGActionSelector',
  get: ({ get }) => {
    const { gSubjectList } = get(workerLabelingCategoryAtom);
    const gActionList = [] as {
      ctg_id: string;
      ctg_name: string;
      ctg_parent_id: string;
    }[];
    if (gSubjectList) {
      gSubjectList.ctg_depth.forEach((subject) => {
        subject.ctg_depth.forEach((action) => {
          const actionObj = {
            ctg_id: action.ctg_id,
            ctg_name: action.ctg_name,
            ctg_parent_id: subject.ctg_id,
          };
          gActionList.push(actionObj);
        });
      });
    }

    return gActionList;
  },
});

const workerLabelingGObjectSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingGObjectSelector',
  get: ({ get }) => {
    const { gObjectList } = get(workerLabelingCategoryAtom);
    return gObjectList?.ctg_depth || [];
  },
});

const workerLabelingIntentSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingIntentSelector',
  get: ({ get }) => {
    const { intentList } = get(workerLabelingCategoryAtom);
    return intentList?.ctg_depth || [];
  },
});

const workerLabelingFuncSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingFuncSelector',
  get: ({ get }) => {
    const { funcList } = get(workerLabelingCategoryAtom);
    return funcList?.ctg_depth || [];
  },
});

const workerLabelingNonVerbalEmotionSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingNonVerbalEmotionSelector',
  get: ({ get }) => {
    const { nonVerbalEmotionList } = get(workerLabelingCategoryAtom);
    return nonVerbalEmotionList?.ctg_depth || [];
  },
});

const workerLabelingNonVerbalAffectiveSelector = selector<IJobCategoryListDepth[]>({
  key: 'workerLabelingNonVerbalAffectiveSelector',
  get: ({ get }) => {
    const { nonVerbalAffectiveList } = get(workerLabelingCategoryAtom);
    return nonVerbalAffectiveList?.ctg_depth || [];
  },
});

export {
  workerLabelingCategoryAtom,
  workerLabelingAffectiveSelector,
  workerLabelingChannelSelector,
  workerLabelingSentimentSelector,
  workerLabelingBcIntentSelector,
  workerLabelingFcIntentSelector,
  workerLabelingEmotionSelector,
  workerLabelingVerbalVADSelector,
  workerLabelingOverallVADSelector,
  workerLabelingParaverbalSelector,
  workerLabelingAngleSelector,
  workerLabelingGSubjectSelector,
  workerLabelingGActionSelector,
  workerLabelingGObjectSelector,
  workerLabelingIntentSelector,
  workerLabelingFuncSelector,
  workerLabelingNonVerbalEmotionSelector,
  workerLabelingNonVerbalAffectiveSelector,
};
