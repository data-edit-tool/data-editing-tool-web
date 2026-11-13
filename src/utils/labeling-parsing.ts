import {
  IJobFormNonverbal,
  IJobFormParingNonverbal,
  IJobFormParingPavaverbal,
  IJobFormPavaverbal,
  IJobStartFormLabeling,
  IJobStartFormParingVerbal,
  IJobStartFormVerbal,
  IJobStep2FormLabeling,
  IJobStep3FormLabeling,
  ILabelingAll,
  ILabelingInfoList,
} from 'types/worker-interface';

export const createEmptyVerbalLabelingGroups = (
  labelingInfoList: ILabelingInfoList[] = [],
  existingSpeakerIds: Set<string> = new Set(),
): IJobStartFormLabeling[] => {
  return labelingInfoList
    .filter((labelingInfo) => !existingSpeakerIds.has(labelingInfo.speaker_id))
    .map((labelingInfo) => ({
      labeling_id: labelingInfo.labeling_id,
      speaker_id: labelingInfo.speaker_id,
      verbal: [],
    }));
};

// verbal 파싱
export const isVerbalParing = (labelingList: ILabelingAll[], labelingInfoList: ILabelingInfoList[], formStatus?: boolean) => {
  const speakerIdList = new Set<string>();
  const parsingLabelingObject = {} as {
    [key: string]: IJobStartFormParingVerbal[];
  };

  labelingList.forEach((labeling) => {
    const paring = {
      start_time: labeling.start_time,
      end_time: labeling.end_time,
      speaker_id: labeling.speaker_id,
      verbal_id: labeling.verbal_id,
      sentence: labeling.sentence,
      channel: labeling.channel,
      sentiment: labeling.sentiment,
      fc_intent: labeling.fc_intent,
      bc_intent: labeling.bc_intent,
      emotion: labeling.emotion,
      affective_state: labeling.affective_state,
      verbal_vad: labeling.verbal_vad,
      overall_vad: labeling.overall_vad,
    } as IJobStartFormParingVerbal;
    // 등록시에는 클라이언트에서 추가한 verbal_id가 있으므로 삭제
    if (formStatus && !isNaN(Number(labeling.verbal_id))) {
      delete paring.verbal_id;
    }
    if (parsingLabelingObject[labeling.labeling_id]) {
      parsingLabelingObject[labeling.labeling_id].push(paring);
    } else {
      parsingLabelingObject[labeling.labeling_id] = [paring];
    }
  });

  const newArray = [] as IJobStartFormLabeling[];
  Object.keys(parsingLabelingObject).forEach((key) => {
    const verbalList: IJobStartFormParingVerbal[] = [];
    parsingLabelingObject[key].forEach((item) => {
      speakerIdList.add(item.speaker_id);
      const paring = {
        start_time: item.start_time,
        end_time: item.end_time,
        verbal_id: item.verbal_id,
        sentence: item.sentence,
        channel: item.channel,
        sentiment: item.sentiment,
        fc_intent: item.fc_intent,
        bc_intent: item.bc_intent,
        emotion: item.emotion,
        affective_state: item.affective_state,
        verbal_vad: item.verbal_vad,
        overall_vad: item.overall_vad,
        speaker_id: item.speaker_id,
        labeling_id: key,
      } as IJobStartFormParingVerbal;
      // 등록시에는 클라이언트에서 추가한 verbal_id가 있으므로 삭제
      if (formStatus && !isNaN(Number(paring.verbal_id))) {
        delete paring.verbal_id;
      }
      verbalList.push(paring);
    });

    // 시간 정렬
    verbalList.sort((a, b) => {
      return a.start_time - b.start_time;
    });

    newArray.push({
      labeling_id: key,
      speaker_id: parsingLabelingObject[key][0].speaker_id,
      verbal: verbalList,
    });
  });

  // 발화자와 라벨링 정보의 발화자가 크기가 다르면 추가해줘야함
  if (labelingInfoList && speakerIdList.size !== labelingInfoList.length) {
    // 만약 없으면 빈 배열로 보내야함
    newArray.push(...createEmptyVerbalLabelingGroups(labelingInfoList, speakerIdList));
  }

  return newArray.sort((a, b) => a.speaker_id.localeCompare(b.speaker_id));
};

// paraverbal 파싱
export const isParaverbalParing = (labelingList: ILabelingAll[], labelingInfoList: ILabelingInfoList[], formStatus?: boolean) => {
  const speakerIdList = new Set();
  const parsingLabelingObject = {} as {
    [key: string]: IJobFormParingPavaverbal[];
  };

  labelingList.forEach((labeling) => {
    const paring = {
      start_time: labeling.start_time,
      end_time: labeling.end_time,
      speaker_id: labeling.speaker_id,
      func: labeling.func,
      paraverbal_id: labeling.paraverbal_id,
    } as IJobFormParingPavaverbal;
    // 등록시에는 클라이언트에서 추가한 paraverbal_id가 있으므로 삭제
    if (formStatus && !isNaN(Number(labeling.paraverbal_id))) {
      delete paring.paraverbal_id;
    }
    if (parsingLabelingObject[labeling.labeling_id]) {
      parsingLabelingObject[labeling.labeling_id].push(paring);
    } else {
      parsingLabelingObject[labeling.labeling_id] = [paring];
    }
  });

  const newArray = [] as IJobStep2FormLabeling[];
  Object.keys(parsingLabelingObject).forEach((key) => {
    const paraverbalList: IJobFormPavaverbal[] = [];
    parsingLabelingObject[key].forEach((item) => {
      speakerIdList.add(item.speaker_id);
      const paring = {
        start_time: item.start_time,
        end_time: item.end_time,
        func: item.func,
        paraverbal_id: item.paraverbal_id,
      } as IJobFormPavaverbal;
      // 등록시에는 클라이언트에서 추가한 paraverbal_id 있으므로 삭제
      if (formStatus && !isNaN(Number(paring.paraverbal_id))) {
        delete paring.paraverbal_id;
      }
      paraverbalList.push(paring);
    });

    newArray.push({
      labeling_id: key,
      speaker_id: parsingLabelingObject[key][0].speaker_id,
      verbal: [],
      paraverbal: paraverbalList,
    });
  });

  // 발화자와 라벨링 정보의 발화자가 크기가 다르면 추가해줘야함
  if (labelingInfoList && speakerIdList.size !== labelingInfoList.length) {
    const speakerIdSet = new Set<ILabelingInfoList>();
    labelingInfoList.forEach((labelingInfo) => {
      speakerIdSet.add({
        speaker_id: labelingInfo.speaker_id,
        labeling_id: labelingInfo.labeling_id,
      });
    });

    speakerIdSet.forEach((speakerId) => {
      if (!speakerIdList.has(speakerId.speaker_id)) {
        newArray.push({
          labeling_id: speakerId.labeling_id,
          speaker_id: speakerId.speaker_id,
          verbal: [],
          paraverbal: [],
        });
      }
    });
  }

  return newArray;
};

// nonverbal 파싱
export const isNonVerbalParing = (labelingList: ILabelingAll[], labelingInfoList: ILabelingInfoList[], formStatus?: boolean) => {
  const speakerIdList = new Set();
  const parsingLabelingObject = {} as {
    [key: string]: IJobFormParingNonverbal[];
  };

  labelingList.forEach((labeling) => {
    const paring = {
      start_time: labeling.start_time,
      end_time: labeling.end_time,
      angle: labeling.angle,
      speaker: labeling.speaker,
      subject: labeling.subject,
      action: labeling.action,
      action_str: labeling.action_str,
      obj: labeling.obj,
      intent: labeling.intent,
      func: labeling.func,
      emotion: labeling.emotion,
      affective_state: labeling.affective_state,
      speaker_id: labeling.speaker_id,
      nonverbal_id: labeling.nonverbal_id,
    } as IJobFormParingNonverbal;
    // 등록시에는 클라이언트에서 추가한 nonverbal_id가 있으므로 삭제
    if (formStatus && !isNaN(Number(labeling.nonverbal_id))) {
      delete paring.nonverbal_id;
    }
    if (parsingLabelingObject[labeling.labeling_id]) {
      parsingLabelingObject[labeling.labeling_id].push(paring);
    } else {
      parsingLabelingObject[labeling.labeling_id] = [paring];
    }
  });

  const newArray = [] as IJobStep3FormLabeling[];
  Object.keys(parsingLabelingObject).forEach((key) => {
    const nonVerbalList: IJobFormNonverbal[] = [];
    parsingLabelingObject[key].forEach((item) => {
      speakerIdList.add(item.speaker_id);
      const paring = {
        start_time: item.start_time,
        end_time: item.end_time,
        angle: item.angle,
        subject: item.subject,
        action: item.action,
        action_str: item.action_str,
        obj: item.obj,
        intent: item.intent,
        func: item.func,
        emotion: item.emotion,
        affective_state: item.affective_state,
        speaker_id: item.speaker_id,
        nonverbal_id: item.nonverbal_id,
      } as IJobFormNonverbal;
      // 등록시에는 클라이언트에서 추가한 nonverbal_id가 있으므로 삭제
      if (formStatus && !isNaN(Number(paring.nonverbal_id))) {
        delete paring.nonverbal_id;
      }
      nonVerbalList.push(paring);
    });

    newArray.push({
      labeling_id: key,
      speaker_id: parsingLabelingObject[key][0].speaker_id,
      nonverbal: nonVerbalList,
      verbal: [],
    });
  });

  // 발화자와 라벨링 정보의 발화자가 크기가 다르면 추가해줘야함
  if (labelingInfoList && speakerIdList.size !== labelingInfoList.length) {
    const speakerIdSet = new Set<ILabelingInfoList>();
    labelingInfoList.forEach((labelingInfo) => {
      speakerIdSet.add({
        speaker_id: labelingInfo.speaker_id,
        labeling_id: labelingInfo.labeling_id,
      });
    });

    speakerIdSet.forEach((speakerId) => {
      if (!speakerIdList.has(speakerId.speaker_id)) {
        newArray.push({
          labeling_id: speakerId.labeling_id,
          speaker_id: speakerId.speaker_id,
          nonverbal: [],
          verbal: [],
        });
      }
    });
  }

  return newArray;
};

export const isVerbalCompareParing = (originalVerbalList: ILabelingAll[], verbalList: ILabelingAll[]) => {
  const changedVerbalList: { [key: string]: ILabelingAll } = originalVerbalList.reduce((acc, item) => {
    acc[item.verbal_id] = item;
    return acc;
  }, {} as { [key: string]: ILabelingAll });
  // 변경된 verbalList와 원본 verbalList 비교
  return verbalList
    .filter((item) => {
      const matchingItem = changedVerbalList[item.verbal_id];
      return (
        matchingItem && (item.start_time !== matchingItem.start_time || item.end_time !== matchingItem.end_time || item.sentence !== matchingItem.sentence)
      );
    })
    .map((item) => ({
      start_time: item.start_time,
      end_time: item.end_time,
      verbal_id: item.verbal_id,
      sentence: item.sentence,
      labeling_id: item.labeling_id,
    }));
};

export const isVerbalCheck = (labelingList: IJobStartFormLabeling[]) => {
  const newLabelingList = [...labelingList];
  let isCheck = false;
  let previousElement = null as IJobStartFormVerbal | null;
  newLabelingList.forEach((labeling) => {
    previousElement = null;
    labeling.verbal.forEach((verbal) => {
      if (previousElement && previousElement.end_time > verbal.start_time) {
        isCheck = true;
      }
      previousElement = verbal;
    });
  });
  return isCheck;
};

export const isParaverbalCheck = (labelingList: IJobStep2FormLabeling[]) => {
  const newLabelingList = [...labelingList];
  let isCheck = false;
  let previousElement = null as IJobFormPavaverbal | null;
  newLabelingList.forEach((labeling) => {
    previousElement = null;
    labeling.paraverbal.forEach((paraverbal) => {
      if (previousElement && previousElement.end_time > paraverbal.start_time) {
        isCheck = true;
      }
      previousElement = paraverbal;
    });
  });
  return isCheck;
};

export const isNonVerbalCheck = (labelingList: IJobStep3FormLabeling[]) => {
  const newLabelingList = [...labelingList];
  let isCheck = false;
  let previousElement = null as IJobFormNonverbal | null;
  newLabelingList.forEach((labeling) => {
    previousElement = null;
    labeling.nonverbal.forEach((nonverbal) => {
      if (previousElement && previousElement.end_time > nonverbal.start_time) {
        isCheck = true;
      }
      previousElement = nonverbal;
    });
  });
  return isCheck;
};
