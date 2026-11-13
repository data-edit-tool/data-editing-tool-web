import { Fragment, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import durationAtom from 'state/duration.atom';
import { viewerLabelingListSelector } from 'state/viewer-labeling';
import { viewerLoadingSelector } from 'state/viewer-loading';
import { viewerLabelingGSubjectSelector, viewerLabelingParaverbalSelector } from 'state/viwer-labeling-category-list';
import { styled } from 'styled-components';
import { ILabelingSpeakers } from 'types/worker-interface';

import AutoScroll from 'components/Common/Worker/AutoScroll';
import ScaleGraduation from 'components/Common/Worker/ScaleGraduation';
import ModalContainer from 'components/Modal';
import WorkerProfile from 'components/Modal/WorkerProfile';
import SpackerArrow from 'components/SVG/Icon/SpackerArrow';

import LabelingGazeArea from '../LabelingGazeArea';
import LabelingLoudnessWave from '../LabelingLoudnessWave';
import LabelingParaNonArea from '../LabelingParaNonArea';
import LabelingPitchWave from '../LabelingPitchWave';
import LabelingVerbalArea from '../LabelingVerbalArea';

const ViewerSpeakerSectionWrapper = styled.div`
  width: 100%;
  min-height: 332px;
  margin-top: 16px;
  display: flex;
  background-color: #141519;
  .speaker-box {
    width: 276px;
    padding: 20px;
    justify-content: space-between;
    .title-info {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: ${({ theme }) => theme.fontSize.text_14};
        color: ${({ theme }) => theme.workerColor.white};
      }
      .delete-box {
        display: flex;
        align-items: center;
        svg {
          cursor: pointer;
        }
        span {
          color: ${({ theme }) => theme.workerColor.txt2};
          font-size: ${({ theme }) => theme.fontSize.text_12};
          margin-right: 4px;
        }
      }
    }
    & > ul {
      margin-top: 12px;
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background-color: ${({ theme }) => theme.workerColor.line1};
      & > li {
        display: flex;
        align-items: center;
        flex-direction: column;
        & > ul {
          display: flex;
          flex-direction: column;
          padding: 4px 8px;
          gap: 8px;
          width: 100%;
          margin-top: 8px;
          border-radius: 4px;
          background-color: #3c4657;
          margin-bottom: 7px;
          & > li {
            display: flex;
            flex-direction: column;
            gap: 12px;
            & > div {
              display: flex;
              width: 100%;
              font-size: 14px;
              line-height: 20px;
              color: #8496b5;
              justify-content: left;
              &.speaker-header {
                width: 100%;
                height: 20px;
                justify-content: space-between;
                color: #f7f8fd;
                font-weight: 500;
                line-height: 24px;
                cursor: pointer;
                svg {
                  margin-top: 9px;
                  transition: transform 0.2s ease;
                }
                &.collapsed {
                  svg {
                    transform: rotate(180deg);
                  }
                }
              }
              &.h-52 {
                height: 52px;
              }
            }
          }
        }
        .speaker-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0px 4px;
          cursor: pointer;
          .speaker-info-left {
            display: flex;
            align-items: center;
            gap: 8px;
            & > img {
              width: 24px;
              height: 24px;
              cursor: pointer;
            }
            & > span {
              font-size: ${({ theme }) => theme.fontSize.text_14};
              color: ${({ theme }) => theme.workerColor.txt2};
              font-weight: 700;
            }
          }
        }
      }
    }
  }
  .subtitle-box {
    padding-top: 154px;
  }
  .labeling-box {
    padding-top: 19px;
    ul {
      li {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
`;

const ViewerSpeakerSection = () => {
  const labelingList = useRecoilValue(viewerLabelingListSelector);
  const loading = useRecoilValue(viewerLoadingSelector);
  const speakerList = labelingList.map((item) => item.speakers);
  const verbalList = labelingList.map((item) => item.verbalList);
  const paraverbalList = labelingList.map((item) => item.paraverbalList);
  const nonVerbalList = labelingList.map((item) => item.nonVerbalList);
  const paraverbalCategoryList = useRecoilValue(viewerLabelingParaverbalSelector);
  const gSubjectList = useRecoilValue(viewerLabelingGSubjectSelector);
  const duration = useRecoilValue(durationAtom);

  const [selectSpeaker, setSelectSpeaker] = useState<string[]>([]);
  const [speakerSectionOpenState, setSpeakerSectionOpenState] = useState<Record<string, Record<string, boolean>>>({});
  const [isAlert, setAlert] = useState({
    open: false,
    title: '',
    imageUrl: '',
  });

  const speakerIds = useMemo(() => speakerList.map((speaker) => speaker.speaker_id), [speakerList]);

  useEffect(() => {
    setSelectSpeaker((prev) => {
      if (prev.length === speakerIds.length && prev.every((id, i) => id === speakerIds[i])) {
        return prev;
      }
      return speakerIds;
    });
  }, [speakerIds]);

  // Pre-group lists to avoid filtering on every render
  type ParaverbalMap = Record<string | number, (typeof paraverbalList)[number]>;
  type NonVerbalMap = Record<string | number, (typeof nonVerbalList)[number]>;

  const paraverbalBySpeaker = useMemo(
    () =>
      paraverbalList.map((list) => {
        const grouped: ParaverbalMap = {};
        list.forEach((item) => {
          const key = item.func as unknown as string | number;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(item);
        });
        return grouped;
      }),
    [paraverbalList],
  );

  const nonVerbalBySpeaker = useMemo(
    () =>
      nonVerbalList.map((list) => {
        const grouped: NonVerbalMap = {};
        list.forEach((item) => {
          const key = item.subject as unknown as string | number;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(item);
        });
        return grouped;
      }),
    [nonVerbalList],
  );

  const voiceMeasurementsList = useMemo(() => labelingList.map((item) => item.voice_measurements), [labelingList]);

  // 발화자 클릭시
  const handleSpeaker = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, { speaker_id, thumbnail_file_url }: ILabelingSpeakers) => {
    e.stopPropagation();
    setAlert({
      open: true,
      title: speaker_id,
      imageUrl: thumbnail_file_url,
    });
  };

  const onProfileConfirm = () => {
    setAlert({
      open: false,
      title: '',
      imageUrl: '',
    });
  };

  const handleSpeakerInfo = (speaker: ILabelingSpeakers) => {
    if (selectSpeaker.includes(speaker.speaker_id)) {
      setSelectSpeaker(selectSpeaker.filter((id) => id !== speaker.speaker_id));
      return;
    }
    setSelectSpeaker([...selectSpeaker, speaker.speaker_id]);
  };

  const toggleSectionOpenState = (speakerId: string, section: 'paraverbal' | 'gSubject') => {
    setSpeakerSectionOpenState((prev) => {
      const speakerState = prev[speakerId] ?? { paraverbal: true, gSubject: true };
      return {
        ...prev,
        [speakerId]: {
          ...speakerState,
          [section]: !speakerState[section],
        },
      };
    });
  };

  const isSectionOpen = (speakerId: string, section: 'paraverbal' | 'gSubject') => speakerSectionOpenState[speakerId]?.[section] ?? true;

  return (
    <ViewerSpeakerSectionWrapper style={{ visibility: loading ? 'hidden' : 'visible' }}>
      {isAlert.open && (
        <ModalContainer id="modal">
          <WorkerProfile title={isAlert.title} imageUrl={isAlert.imageUrl} onConfirm={onProfileConfirm} />
        </ModalContainer>
      )}
      <div className="speaker-box">
        <div className="title-info">
          <div className="title">발화자 ID</div>
        </div>
        <ul>
          {speakerList.map((speaker) => {
            const isParaverbalOpen = isSectionOpen(speaker.speaker_id, 'paraverbal');
            const isGSubjectOpen = isSectionOpen(speaker.speaker_id, 'gSubject');

            return (
              <Fragment key={`speaker-${speaker.speaker_id}`}>
                <li>
                  <div className="speaker-info" onClick={() => handleSpeakerInfo(speaker)}>
                    <div className="speaker-info-left">
                      <img src={speaker.thumbnail_file_url} alt={speaker.speaker_id} onClick={(e) => handleSpeaker(e, speaker)} />
                      <span>{speaker.speaker_id}</span>
                    </div>
                    <SpackerArrow />
                  </div>
                  {selectSpeaker.includes(speaker.speaker_id) && (
                    <ul>
                      <li>
                        <div
                          className={classNames('speaker-header', 'h-52', { collapsed: !isParaverbalOpen })}
                          onClick={() => toggleSectionOpenState(speaker.speaker_id, 'paraverbal')}
                        >
                          <span>Para-verbal(Pitch)</span>
                          <SpackerArrow />
                        </div>
                        {isParaverbalOpen && (
                          <>
                            <div className="h-52">Loudness</div>
                            {paraverbalCategoryList.map((paraverbal) => (
                              <div key={`paraverbal-${paraverbal.ctg_id}`}>
                                <span>{paraverbal.ctg_name}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </li>
                      <li>
                        <div
                          className={classNames('speaker-header', { collapsed: !isGSubjectOpen })}
                          onClick={() => toggleSectionOpenState(speaker.speaker_id, 'gSubject')}
                        >
                          <span>Non-verbal</span>
                          <SpackerArrow />
                        </div>
                        {isGSubjectOpen &&
                          gSubjectList.map((gSubject) => (
                            <div key={`gSubject-${gSubject.ctg_id}`}>
                              <span>{gSubject.ctg_name}</span>
                            </div>
                          ))}
                      </li>
                    </ul>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ul>
      </div>
      <AutoScroll totalTime={duration}>
        <div className="subtitle-box">
          <ScaleGraduation />
          <div className="labeling-box">
            <ul>
              {speakerList.map((speaker, speakerIndex) => {
                const isParaverbalOpen = isSectionOpen(speaker.speaker_id, 'paraverbal');
                const isGSubjectOpen = isSectionOpen(speaker.speaker_id, 'gSubject');
                const verbalSelectedList = verbalList[speakerIndex];
                const paraverbalGroup = paraverbalBySpeaker[speakerIndex] ?? {};
                const nonVerbalGroup = nonVerbalBySpeaker[speakerIndex] ?? {};
                const voiceMeasurements = voiceMeasurementsList[speakerIndex] ?? [];
                return (
                  <Fragment key={`labeling-speaker-${speaker.speaker_id}`}>
                    <>
                      <li>
                        <LabelingVerbalArea verbalList={verbalSelectedList} />
                        {selectSpeaker.includes(speaker.speaker_id) && (
                          <>
                            <LabelingPitchWave voiceMeasurements={voiceMeasurements} />
                            {isParaverbalOpen && (
                              <>
                                <LabelingLoudnessWave voiceMeasurements={voiceMeasurements} />
                                {paraverbalCategoryList.map((paraverbal, categoryIndex) => (
                                  <LabelingParaNonArea
                                    key={`paraverbal-list-labeling-${speaker.speaker_id}-${paraverbal.ctg_id}`}
                                    list={paraverbalGroup?.[paraverbal.ctg_id] ?? []}
                                    index={categoryIndex}
                                    type="paraverbal"
                                  />
                                ))}
                              </>
                            )}
                            <LabelingGazeArea list={[]} />
                            {/* {isGSubjectOpen && <LabelingGazeArea list={verbalList} />} */}
                            {isGSubjectOpen &&
                              gSubjectList.map((gSubject, categoryIndex) => (
                                <LabelingParaNonArea
                                  key={`gSubject-labeling-${speaker.speaker_id}-${gSubject.ctg_id}`}
                                  list={nonVerbalGroup?.[gSubject.ctg_id] ?? []}
                                  index={categoryIndex}
                                  type="gSubject"
                                />
                              ))}
                          </>
                        )}
                      </li>
                    </>
                  </Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      </AutoScroll>
    </ViewerSpeakerSectionWrapper>
  );
};

export default ViewerSpeakerSection;
