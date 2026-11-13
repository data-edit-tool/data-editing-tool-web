/* eslint-disable indent */
import { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue } from 'recoil';
import durationAtom from 'state/duration.atom';
import { scrollLeftAtom } from 'state/scrollLeft.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import {
  workerLabelingInfoListSelector,
  workerLabelingListSelector,
  workerLabelingMetaSelector,
  workerLabelingSpeakersLabelingListSelector,
  workerLabelingSpeakersSelector,
  workerLabelingVerbalListSelector,
  workerLabelingVerbalResizeListSelector,
  workerLabelingViewerStepSelector,
} from 'state/worker-labeling';
import { workerLabelingGSubjectSelector, workerLabelingParaverbalSelector } from 'state/worker-labeling-category-list';
import { workerLabelingHistoryIndexSelector, workerLabelingHistoryListSelector } from 'state/worker-labeling-history-list';
import { workerTypeSelector } from 'state/worker-project';
import { workerSpeakerSelector } from 'state/worker-speaker';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { ILabelingAll, ILabelingSpeakers } from 'types/worker-interface';

import ModalContainer from 'components/Modal';
import WorkerProfile from 'components/Modal/WorkerProfile';
import Arrow from 'components/SVG/Icon/Arrow';

import AutoScroll from '../AutoScroll';
import ResizableSections from '../ResizableSections';
import ScaleGraduation from '../ScaleGraduation';

const SpeakerSectionWrapper = styled.div`
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
      padding: 0px 4px;
      & > li {
        display: flex;
        align-items: center;
        height: 32px;
        margin-bottom: 12px;
        padding: 0px 8px 0px 4px;
        &:last-child {
          margin-bottom: 0px;
        }
        &.step2-back {
          background-color: ${({ theme }) => theme.workerColor.line1};
          &.open {
            & > svg {
              transform: rotate(180deg);
            }
          }
          & > svg {
            cursor: pointer;
            margin-left: auto;
          }
        }
        & > img {
          width: 24px;
          height: 24px;
          margin-right: 8px;
          cursor: pointer;
        }
        & > span {
          font-size: ${({ theme }) => theme.fontSize.text_14};
          color: ${({ theme }) => theme.workerColor.txt2};
        }
        &.step2,
        &.step3 {
          height: auto;
          cursor: text;
          & > ul {
            margin: 0px 0px 12px 12px;
            padding-left: 19px;
            border-left: 1px solid #2a354a;
            & > li {
              display: flex;
              align-items: center;
              height: 32px;
              margin-bottom: 6px;
              &:last-child {
                margin-bottom: 0px;
              }
              & > span {
                font-size: ${({ theme }) => theme.fontSize.text_14};
                color: ${({ theme }) => theme.workerColor.txt2};
              }
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
        margin-bottom: 12px;
        &:last-child {
          margin-bottom: 0px;
        }
        &.step2,
        &.step3 {
          & > ul {
            margin-bottom: 24px;
            & > li {
              margin-bottom: 6px;
              &:last-child {
                margin-bottom: 0px;
              }
            }
          }
        }
      }
    }
  }
`;

const SpeakerSection = () => {
  const projectMeta = useRecoilValue(workerLabelingMetaSelector);
  const speakerList = useRecoilValue(workerLabelingSpeakersSelector);
  const paraverbalList = useRecoilValue(workerLabelingParaverbalSelector);
  const gSubjectList = useRecoilValue(workerLabelingGSubjectSelector);
  const labelingInfoList = useRecoilValue(workerLabelingInfoListSelector);
  const duration = useRecoilValue(durationAtom);
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const scrollWidth = useRecoilValue(scrollWidthAtom);
  const workerType = useRecoilValue(workerTypeSelector);
  // const [isOpenSpeaker, setIsOpenSpeaker] = useState<string[]>([]);
  const [step, setStep] = useState<number | null>(null);
  const labelHistoryIndex = useRecoilValue(workerLabelingHistoryIndexSelector);
  const [labelHistoryList, setLabelHistoryList] = useRecoilState(workerLabelingHistoryListSelector);

  const [isAlert, setAlert] = useState({
    open: false,
    title: '',
    imageUrl: '',
  });

  // const [sectionData, setSectionData] = useRecoilState(speakerSectionsAtom);
  const [labelingList, setLabelingList] = useRecoilState(workerLabelingListSelector);
  const allLabelingList = useRecoilValue(workerLabelingSpeakersLabelingListSelector);
  const step2And3VerbalLabelingList = useRecoilValue(workerLabelingVerbalListSelector);
  const viewerStep = useRecoilValue(workerLabelingViewerStepSelector);
  const [selectSpeaker, setSelectSpeaker] = useRecoilState(workerSpeakerSelector);
  const [verbalLabelingList, setVerbalLabelingList] = useRecoilState(workerLabelingVerbalResizeListSelector);
  const selectedSection = useRecoilValue(selectedSectionAtom);

  // Viewport seconds based on current scroll position and fixed viewport width (matches AutoScroll)
  const VIEWPORT_PX = 1488; // keep in sync with AutoScroll wrapper width
  const pxPerSec = scrollWidth / duration;
  const viewportStartSec = Number.isFinite(pxPerSec) && pxPerSec > 0 ? scrollLeft / pxPerSec : undefined;
  const viewportEndSec = Number.isFinite(pxPerSec) && pxPerSec > 0 ? (scrollLeft + VIEWPORT_PX) / pxPerSec : undefined;

  useEffect(() => {
    setSelectSpeaker([]);
  }, [projectMeta?.step]);

  useEffect(() => {
    // 작업자 종류에 따른 step 변경
    if (projectMeta && workerType) {
      if (workerType === 'W') {
        setStep(projectMeta?.step);
      } else if (workerType === 'V' || (workerType === 'C' && (projectMeta?.work_status === 'IC' || projectMeta?.work_status === 'NU'))) {
        setStep(viewerStep);
      } else if (workerType === 'C') {
        setStep(projectMeta?.check_step);
      }
    }
  }, [projectMeta?.step, projectMeta?.check_step, workerType, viewerStep]);

  // 데이터 업데이트
  const handleResize = (id: string, newStartTime: number, newEndTime: number, type?: string) => {
    if (type === 'step') {
      const labelingData = verbalLabelingList.find((labeling) => id === labeling.verbal_id);
      if (labelingData) {
        const newLabeling = {
          ...labelingData,
          start_time: newStartTime,
          end_time: newEndTime,
        };

        const newLabelingList = verbalLabelingList.map((labeling) =>
          labeling.verbal_id === id ? { ...newLabeling, active: true, selected: true } : { ...labeling, active: false, selected: false },
        );
        const newLabelingHistoryList = [...labelHistoryList];

        const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

        setLabelHistoryList([
          ...newLabelingHistorySpliceList,
          {
            type: 'edit',
            data: JSON.stringify(labelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
            verbal: JSON.stringify(newLabelingList),
            selectSpeaker,
          },
        ]);

        setVerbalLabelingList(newLabelingList);
      }
      return;
    }
    if (step === 1) {
      const newLabelingList = labelingList.map((labeling) => {
        if (labeling.verbal_id === id) {
          return {
            ...labeling,
            start_time: newStartTime,
            end_time: newEndTime,
            active: true,
            selected: true,
          };
        }
        return {
          ...labeling,
          active: false,
          selected: false,
        };
      });
      const newLabelingHistoryList = [...labelHistoryList];

      const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);
      setLabelHistoryList([...newLabelingHistorySpliceList, { type: 'edit', data: JSON.stringify(newLabelingList), selectSpeaker }]);
      setLabelingList(newLabelingList);
      return;
    } else if (step === 2) {
      const newLabelingList = labelingList.map((labeling) => {
        if (labeling.paraverbal_id === id) {
          return {
            ...labeling,
            start_time: newStartTime,
            end_time: newEndTime,
            active: true,
            selected: true,
          };
        }
        return {
          ...labeling,
          active: false,
          selected: selectedSection.map((section) => section.id).includes(labeling.paraverbal_id),
        };
      });
      const newLabelingHistoryList = [...labelHistoryList];

      const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

      setLabelHistoryList([
        ...newLabelingHistorySpliceList,
        {
          type: 'edit',
          data: JSON.stringify(newLabelingList),
          verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
          selectSpeaker,
        },
      ]);
      setLabelingList(newLabelingList);
      return;
    } else if (step === 3) {
      const newLabelingList = labelingList.map((labeling) => {
        if (labeling.nonverbal_id === id) {
          return {
            ...labeling,
            start_time: newStartTime,
            end_time: newEndTime,
            selected: true,
            active: true,
          };
        }
        return {
          ...labeling,
          active: false,
          selected: false,
        };
      });
      const newLabelingHistoryList = [...labelHistoryList];

      const newLabelingHistorySpliceList = newLabelingHistoryList.splice(0, labelHistoryIndex);

      setLabelHistoryList([
        ...newLabelingHistorySpliceList,
        {
          type: 'edit',
          data: JSON.stringify(newLabelingList),
          verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
          selectSpeaker,
        },
      ]);
      setLabelingList(newLabelingList);
      return;
    }
  };

  // 발화자 클릭시
  const handleSpeaker = ({ speaker_id, thumbnail_file_url }: ILabelingSpeakers) => {
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

  // paraverbal, nonverbal 일때 하위메뉴
  const handleListOpen = (speakerId: string) => {
    const allIds = speakerList.map((s) => s.speaker_id);

    // 전체 열림([]) 상태에서 클릭: 해당 발화자만 닫고 나머지는 열림
    if (selectSpeaker.length === 0) {
      setSelectSpeaker(allIds.filter((id) => id !== speakerId));
      return;
    }

    let next: string[];

    if (selectSpeaker.length === allIds.length) {
      // 모두 닫힘 상태에서 클릭하면 해당 하나만 열림
      next = [speakerId];
    } else if (selectSpeaker.includes(speakerId)) {
      // 이미 열려있는 항목을 클릭한 경우 -> 닫기
      if (selectSpeaker.length === 1) {
        // 마지막 하나를 닫으면 "모두 닫힘"을 allIds로 표현
        next = allIds;
      } else {
        next = selectSpeaker.filter((id) => id !== speakerId);
      }
    } else {
      // 닫힌 항목을 여는 경우
      next = [...selectSpeaker, speakerId];
      if (next.length === allIds.length) {
        // 마지막 닫힌 항목을 열면 "전체 열림"([]) 상태로 전환
        next = [];
      }
    }

    setSelectSpeaker(next);
  };

  return (
    <SpeakerSectionWrapper>
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
          {speakerList.map((speaker) => (
            <Fragment key={`speaker-${speaker.speaker_id}`}>
              <li
                className={classNames({
                  'step2-back': step === 2 || step === 3,
                  open: (selectSpeaker.length === 0 || selectSpeaker.includes(speaker.speaker_id)) && selectSpeaker.length !== speakerList.length,
                })}
              >
                <img src={speaker.thumbnail_file_url} alt={speaker.speaker_id} onClick={() => handleSpeaker(speaker)} />
                <span>{speaker.speaker_id}</span>
                {(step === 2 || step === 3) && (
                  <Arrow width="16" height="16" color={theme.workerColor.line2} onClick={() => handleListOpen(speaker.speaker_id)} />
                )}
              </li>
              {step === 2 &&
                !!paraverbalList.length &&
                (selectSpeaker.length === 0 || selectSpeaker.includes(speaker.speaker_id)) &&
                selectSpeaker.length !== speakerList.length && (
                  <li className="step2">
                    <ul>
                      {paraverbalList.map((paraverbal) => (
                        <li key={`paraverbal-${speaker.speaker_id}-${paraverbal.ctg_id}`}>
                          <span>{paraverbal.ctg_name}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              {step === 3 &&
                !!gSubjectList.length &&
                (selectSpeaker.length === 0 || selectSpeaker.includes(speaker.speaker_id)) &&
                selectSpeaker.length !== speakerList.length && (
                  <li className="step3">
                    <ul>
                      {gSubjectList.map((nonVerbal) => (
                        <li key={`non-verbal-${speaker.speaker_id}-${nonVerbal.ctg_id}`}>
                          <span>{nonVerbal.ctg_name}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
            </Fragment>
          ))}
        </ul>
      </div>
      <AutoScroll totalTime={duration}>
        <div className="subtitle-box">
          <ScaleGraduation />
          <div className="labeling-box">
            <ul>
              {(step === null || step === 1) &&
                allLabelingList.map((labeling) => {
                  const findLabelingInfo = labelingInfoList.find((info) => info.speaker_id === labeling.speaker_id);
                  if (!findLabelingInfo) {
                    return null;
                  }
                  return (
                    <li key={`${labeling.labeling_id}`}>
                      <ResizableSections
                        labelingList={labeling.verbal as ILabelingAll[]}
                        labelingId={findLabelingInfo.labeling_id}
                        speakerId={findLabelingInfo.speaker_id}
                        onResize={handleResize}
                        backgroundColor={theme.workerColor.line1}
                        viewportStartSec={viewportStartSec}
                        viewportEndSec={viewportEndSec}
                        overscanSec={2}
                        step={step}
                        disableDragging={
                          (workerType === 'C' &&
                            (projectMeta?.work_status === 'IM' ||
                              projectMeta?.work_status === 'IC' ||
                              projectMeta?.work_status === 'NU' ||
                              projectMeta?.work_status === 'CM')) ||
                          workerType === 'V' ||
                          projectMeta?.work_status === 'RJ' ||
                          projectMeta?.work_status === null
                        }
                      />
                    </li>
                  );
                })}
              {(step === 2 || step === 3) &&
                step2And3VerbalLabelingList.map((labeling) => {
                  const findLabelingInfo = labelingInfoList.find((info) => info.speaker_id === labeling.speaker_id);
                  if (!findLabelingInfo) {
                    return null;
                  }
                  return (
                    <Fragment key={labeling.labeling_id}>
                      <li>
                        <ResizableSections
                          labelingList={labeling.verbal as ILabelingAll[]}
                          labelingId={findLabelingInfo.labeling_id}
                          speakerId={findLabelingInfo.speaker_id}
                          onResize={handleResize}
                          backgroundColor={theme.workerColor.line1}
                          type="step"
                          viewportStartSec={viewportStartSec}
                          viewportEndSec={viewportEndSec}
                          overscanSec={2}
                          step={step}
                          disableDragging={
                            (workerType === 'C' &&
                              (projectMeta?.work_status === 'IM' ||
                                projectMeta?.work_status === 'IC' ||
                                projectMeta?.work_status === 'NU' ||
                                projectMeta?.work_status === 'CM')) ||
                            workerType === 'V' ||
                            projectMeta?.work_status === 'RJ' ||
                            projectMeta?.work_status === null
                          }
                        />
                      </li>
                      {step === 2 && !!paraverbalList.length && (
                        <li
                          className="step2"
                          style={{
                            display:
                              (selectSpeaker.length === 0 || selectSpeaker.includes(labeling.speaker_id)) && selectSpeaker.length !== speakerList.length
                                ? 'block'
                                : 'none',
                          }}
                        >
                          <ul>
                            {paraverbalList.map((paraverbal) => (
                              <li key={`paraverbal-${labeling.labeling_id}-${paraverbal.ctg_id}`}>
                                <ResizableSections
                                  labelingList={labelingList.filter(
                                    (allLabeling) => allLabeling.func === paraverbal.ctg_id && labeling.speaker_id === allLabeling.speaker_id,
                                  )}
                                  labelingId={findLabelingInfo.labeling_id}
                                  speakerId={findLabelingInfo.speaker_id}
                                  onResize={handleResize}
                                  backgroundColor={theme.workerColor.black}
                                  paraverbalFuncId={paraverbal.ctg_id}
                                  viewportStartSec={viewportStartSec}
                                  viewportEndSec={viewportEndSec}
                                  overscanSec={2}
                                  step={step}
                                  disableDragging={
                                    (workerType === 'C' &&
                                      (projectMeta?.work_status === 'IM' ||
                                        projectMeta?.work_status === 'IC' ||
                                        projectMeta?.work_status === 'NU' ||
                                        projectMeta?.work_status === 'CM')) ||
                                    workerType === 'V' ||
                                    projectMeta?.work_status === 'RJ' ||
                                    projectMeta?.work_status === null
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                      {step === 3 && !!gSubjectList.length && (
                        <li
                          className="step3"
                          style={{
                            display:
                              (selectSpeaker.length === 0 || selectSpeaker.includes(labeling.speaker_id)) && selectSpeaker.length !== speakerList.length
                                ? 'block'
                                : 'none',
                          }}
                        >
                          <ul>
                            {gSubjectList.map((gSubject) => (
                              <li key={`non-verbal-${labeling.labeling_id}-${gSubject.ctg_id}`}>
                                <ResizableSections
                                  labelingList={labelingList.filter(
                                    (allLabeling) => allLabeling.subject === gSubject.ctg_id && labeling.speaker_id === allLabeling.speaker_id,
                                  )}
                                  labelingId={findLabelingInfo.labeling_id}
                                  speakerId={findLabelingInfo.speaker_id}
                                  onResize={handleResize}
                                  backgroundColor={theme.workerColor.black}
                                  nonVerbalSubjectId={gSubject.ctg_id}
                                  viewportStartSec={viewportStartSec}
                                  viewportEndSec={viewportEndSec}
                                  overscanSec={2}
                                  step={step}
                                  disableDragging={
                                    (workerType === 'C' &&
                                      (projectMeta?.work_status === 'IM' ||
                                        projectMeta?.work_status === 'IC' ||
                                        projectMeta?.work_status === 'NU' ||
                                        projectMeta?.work_status === 'CM')) ||
                                    workerType === 'V' ||
                                    projectMeta?.work_status === 'RJ' ||
                                    projectMeta?.work_status === null
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                    </Fragment>
                  );
                })}
            </ul>
          </div>
        </div>
      </AutoScroll>
    </SpeakerSectionWrapper>
  );
};

export default SpeakerSection;
