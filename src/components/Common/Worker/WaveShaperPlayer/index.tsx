import { useEffect, useRef, useState } from 'react';
import useWavesurfer from 'hooks/useWaveSuffer';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import durationAtom from 'state/duration.atom';
import { isPlayAtom } from 'state/isPlay.atom';
import { repeatAgainAtom, repeatAtom } from 'state/repeat.atom';
import { scrollLeftAtom } from 'state/scrollLeft.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { sectionAutoSelectBlockAtom } from 'state/section-auto-select-block.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { speedAtom } from 'state/speed.atom';
import { timeAtom } from 'state/time.atom';
import { workerInputOpenIdSelector } from 'state/worker-input-open-id';
import { workerJobFileSelectAudioIdSelector } from 'state/worker-job-file-list';
import {
  workerLabelingListSelector,
  workerLabelingMetaSelector,
  workerLabelingVerbalResizeListSelector,
  workerLabelingViewerStepSelector,
} from 'state/worker-labeling';
import { workerLabelingHistoryIndexSelector, workerLabelingHistoryListSelector } from 'state/worker-labeling-history-list';
import { workerLoadingSelector } from 'state/worker-loading';
import { workerTypeSelector } from 'state/worker-project';
import { workerSpeakerSelector } from 'state/worker-speaker';
import { zoomAtom } from 'state/zoom.atom';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IOption } from 'types/interface';
import { ILabelingAll } from 'types/worker-interface';
import { getSaveWorker } from 'utils/worker-storage';

// import { IJobFileList } from 'types/worker-interface';
import ZoomIn from 'components/SVG/Icon/ZoomIn';
import ZoomOut from 'components/SVG/Icon/ZoomOut';

import Select from '../Select';

const WaveShaperPlayerWrapper = styled.div`
  .audio-option {
    display: flex;
    align-items: center;
    margin-top: 8px;
    svg {
      cursor: pointer;
      z-index: 3;
    }
    .zoom-select {
      z-index: 5000;
      margin: 0px 4px;
      width: auto;
    }
    .speed-select {
      z-index: 5000;
      width: auto;
      margin-left: 20px;
    }
  }
`;

const zoomList = [
  {
    value: '50',
    name: '50%',
  },
  {
    value: '75',
    name: '75%',
  },
  {
    value: '100',
    name: '100%',
  },
  {
    value: '125',
    name: '125%',
  },
  {
    value: '150',
    name: '150%',
  },
  {
    value: '175',
    name: '175%',
  },
  {
    value: '200',
    name: '200%',
  },
  {
    value: '225',
    name: '225%',
  },
  {
    value: '250',
    name: '250%',
  },
];

const speedList = [
  {
    value: 0.5,
    name: 'x0.5',
  },
  {
    value: 0.75,
    name: 'x0.75',
  },
  {
    value: 1,
    name: 'x1(권장)',
  },
  {
    value: 1.25,
    name: 'x1.25',
  },
  {
    value: 1.5,
    name: 'x1.5',
  },
  {
    value: 1.75,
    name: 'x1.75',
  },
  {
    value: 2,
    name: 'x2',
  },
];

const WaveShaperPlayer = () => {
  const waveformRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useRecoilState(zoomAtom);
  const [time, setTime] = useRecoilState(timeAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayAtom);
  const [speed, setSpeed] = useRecoilState(speedAtom);
  const setDuration = useSetRecoilState(durationAtom);
  const setScrollWidth = useSetRecoilState(scrollWidthAtom);
  const setScrollLeft = useSetRecoilState(scrollLeftAtom);

  const setSelectedSection = useSetRecoilState(selectedSectionAtom);
  const [isReplay, setIsReplay] = useRecoilState(repeatAtom);
  const [replayAgain, setReplayAgain] = useRecoilState<boolean>(repeatAgainAtom);
  const selectAudio = useRecoilValue(workerJobFileSelectAudioIdSelector);
  const [seekingTime, setSeekingTime] = useRecoilState(seekingTimeAtom);
  const [isInputOpenId, setIsInputOpenId] = useRecoilState(workerInputOpenIdSelector);
  const [loading, setLoading] = useRecoilState(workerLoadingSelector);
  const [allLabelingList, setAllLabelingList] = useRecoilState(workerLabelingListSelector);
  const [currentSection, setCurrentSection] = useRecoilState(currentSectionAtom);
  const [shiftKey, setShiftKey] = useState<boolean>(false);
  const viewerStep = useRecoilValue(workerLabelingViewerStepSelector);
  const projectMeta = useRecoilValue(workerLabelingMetaSelector);
  const workerType = useRecoilValue(workerTypeSelector);
  const [step, setStep] = useState<number | null>(null);
  const labelHistoryIndex = useRecoilValue(workerLabelingHistoryIndexSelector);
  const [labelHistoryList, setLabelHistoryList] = useRecoilState(workerLabelingHistoryListSelector);
  const selectSpeaker = useRecoilValue(workerSpeakerSelector);
  const [verbalLabelingList, setVerbalLabelingList] = useRecoilState(workerLabelingVerbalResizeListSelector);
  const setAutoSelectBlocked = useSetRecoilState(sectionAutoSelectBlockAtom);

  const { wavesurfer, wsRegions } = useWavesurfer(waveformRef, {
    barWidth: 3,
    barRadius: 3,
    barGap: 2,
    cursorWidth: 1,
    cursorColor: 'transparent',
    waveColor: theme.workerColor.line2,
    progressColor: 'rgb(100, 0, 100)',
    height: 92,
    hideScrollbar: false,
    autoScroll: true,
  });

  useEffect(() => {
    // 작업자 상태에 따른 step 변경
    if (projectMeta && workerType) {
      if (workerType === 'W') {
        setStep(projectMeta?.step);
      } else if (workerType === 'V' || (workerType === 'C' && (projectMeta?.work_status === 'IM' || projectMeta?.work_status === 'IC'))) {
        setStep(viewerStep);
      } else if (workerType === 'C') {
        setStep(projectMeta?.check_step);
      }
    }
  }, [projectMeta?.step, projectMeta?.check_step, workerType, viewerStep, projectMeta?.work_status]);

  useEffect(() => {
    const handleShirtKey = (e: KeyboardEvent) => {
      if (!loading && wavesurfer) {
        setShiftKey(e.shiftKey);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!loading && wavesurfer) {
        setShiftKey(e.shiftKey);
      }
    };
    document.addEventListener('keydown', handleShirtKey);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleShirtKey);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [loading, wavesurfer, setShiftKey]);

  useEffect(() => {
    // 오디오가 바뀌면 웨이브서퍼 다시 재로딩
    if (!wavesurfer) return;

    const url = selectAudio?.file_url;
    if (!url) return;

    setLoading(true);
    wavesurfer.load(url);
  }, [selectAudio?.file_url, wavesurfer, setLoading]);

  useEffect(() => {
    // 초기 줌상태
    if (loading || !wavesurfer || !selectAudio) return;
    if (wavesurfer.getDuration() === 0) return;

    try {
      wavesurfer.zoom(zoom);
    } catch {
      return;
    }

    setScrollWidth(wavesurfer?.getWrapper().scrollWidth ?? 0);
  }, [setScrollWidth, wavesurfer, zoom, loading, selectAudio]);

  useEffect(() => {
    // 초기 줌상태
    if (!loading && wavesurfer && selectAudio && projectMeta) {
      const saveWorker = getSaveWorker();
      if (saveWorker) {
        if (saveWorker.workId === projectMeta.work_id && saveWorker.jobId === projectMeta.job_id && saveWorker.workerId === projectMeta.worker_id) {
          setSeekingTime(saveWorker.timeLine);
        }
      }
    }
  }, [setScrollWidth, wavesurfer, loading, selectAudio, projectMeta, setSeekingTime]);

  useEffect(() => {
    /** 스피드 스피드는 드롭다운으로 해야되지않을가싶음. 이거말씀드려야함.
     * 아님 누를때마다 +로 속도 더해지고 - 로 속도 감소하게 해서 구현.
     */
    if (wavesurfer && !loading) {
      wavesurfer?.setPlaybackRate(speed);
    }
  }, [speed, wavesurfer, loading]);

  useEffect(() => {
    if (wavesurfer) {
      isPlaying ? wavesurfer.play() : wavesurfer.pause();
    }
  }, [isPlaying, wavesurfer]);

  // 비디오에서 시간을 추가하거나 뺀경우는 따로 계산해줘야함.
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setTime(seekingTime);
    }
  }, [seekingTime, wavesurfer]);

  // 1.replay 버튼을 누르면 일단 처음부터 시작하게 해야함.
  // 2. 구간설정이 되어있으면 구간설정된 부분부터 시작하게 해야함.
  // 3. 구간을 넘어가면 다시 시작구간으로 이동해서 다시시작해야함

  useEffect(() => {
    if (isReplay && wavesurfer && replayAgain) {
      setReplayAgain(false);
      wavesurfer.setTime(currentSection?.startTime ?? 0);
      setSeekingTime(currentSection?.startTime ?? 0);
      wavesurfer.play();
    }
  }, [wavesurfer, isReplay, currentSection, replayAgain]);

  useEffect(() => {
    // 구간설정이 되어있고, 재생중이고, 구간설정이 끝나면 재생을 멈춰야함.
    if (wavesurfer && isReplay && isPlaying && currentSection && time / 1000 > currentSection.endTime) {
      wavesurfer.pause();
      setIsReplay(false);
    }
  }, [time, wavesurfer, isReplay, isPlaying, currentSection, setIsReplay]);

  useEffect(() => {
    // #waveform 선택자를 가져옵니다.
    const wavesurferRoot = document.getElementById('waveform');
    const waveSurferShadowRoot = wavesurferRoot?.getElementsByTagName('div')?.[0]?.shadowRoot;

    if (!waveSurferShadowRoot) {
      return;
    }
    // 스크롤 선택자 변경
    const sheet = new CSSStyleSheet();
    sheet.insertRule(`
      :host .scroll::-webkit-scrollbar {
        background-color: #373d48;
        width: 12px;
        height: 12px;
      }
    `);

    sheet.insertRule(`
      :host .scroll::-webkit-scrollbar-track {
        background-color: #373d48;
      }
    `);

    sheet.insertRule(`
      :host .scroll::-webkit-scrollbar-thumb {
        background-color: ${theme.workerColor.line2};
        border-radius: 16px;
      }
    `);

    sheet.insertRule(`
      :host .scroll::-webkit-scrollbar-button {
        display: none;
      }
    `);

    waveSurferShadowRoot.adoptedStyleSheets = [...waveSurferShadowRoot.adoptedStyleSheets, sheet];
  }, []);

  useEffect(() => {
    if (!wavesurfer) return;

    const updateTime = () => {
      if (wavesurfer.getCurrentTime() === 0) {
        setTime(0);
        return;
      }
      setTime(wavesurfer.getCurrentTime() * 1000.0);
      // if (!shiftKey) {
      //   setTime(wavesurfer.getCurrentTime() * 1000.0);
      // }
    };

    // 웨이브서버 함수들
    wavesurfer.on('play', () => {
      if (wavesurfer.getCurrentTime() !== 0) {
        setSeekingTime(wavesurfer.getCurrentTime());
      }
      setIsPlaying(true);
    });
    wavesurfer.on('pause', () => {
      if (wavesurfer.getCurrentTime() !== 0) {
        setSeekingTime(wavesurfer.getCurrentTime());
      }
      setIsPlaying(false);
    });
    wavesurfer.on('timeupdate', updateTime);
    wavesurfer.on('click', () => {
      if (isInputOpenId) {
        const span = document.getElementById(`input-${isInputOpenId}`);
        if (span) {
          // span 요소가 포커스를 받을 수 있도록 설정
          // span.setAttribute('tabindex', '-1');
          // span.focus();

          // enter 키 이벤트 생성
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13, // Enter key code
            code: 'Enter',
            which: 13,
            bubbles: true,
            cancelable: true,
          });

          // 이벤트를 span 요소에 디스패치
          span.dispatchEvent(enterEvent);

          // blur 이벤트 생성 및 디스패치
          const blurEvent = new Event('blur', {
            bubbles: true,
            cancelable: true,
          });
          span.dispatchEvent(blurEvent);
        }
      }

      if (!shiftKey) {
        setSelectedSection([]);
        setCurrentSection(null);
        setAutoSelectBlocked(true);
      } else {
        if (currentSection) {
          let findLabeling = null as ILabelingAll | null | undefined;
          let beforeLabeling = null as ILabelingAll | null | undefined;
          let afterLabeling = null as ILabelingAll | null | undefined;
          if (currentSection.id) {
            if (step === 1) {
              findLabeling = allLabelingList.find((item) => item.verbal_id === currentSection.id);
            } else if (step === 2) {
              findLabeling = allLabelingList.find((item) => item.paraverbal_id === currentSection.id);
            } else if (step === 3) {
              findLabeling = allLabelingList.find((item) => item.nonverbal_id === currentSection.id);
            }
          }
          if (!findLabeling) {
            findLabeling = verbalLabelingList.find((item) => item.verbal_id === currentSection.id);
            if (findLabeling) {
              const speakLabelingList = verbalLabelingList.filter((item) => item.speaker_id === findLabeling?.speaker_id);
              for (let i = 0; i < speakLabelingList.length; i++) {
                if (speakLabelingList[i].verbal_id === currentSection.id) {
                  beforeLabeling = speakLabelingList[i - 1] || null;
                  afterLabeling = speakLabelingList[i + 1] || null;
                }
              }
            }
          } else {
            const speakLabelingList = allLabelingList.filter((item) => {
              if (item.speaker_id === findLabeling?.speaker_id) {
                if (step === 1) {
                  return item;
                } else if (step === 2) {
                  if (item.func === findLabeling.func) {
                    return item;
                  }
                } else if (step === 3) {
                  if (item.subject === findLabeling.subject) {
                    return item;
                  }
                }
              }
            });
            for (let i = 0; i < speakLabelingList.length; i++) {
              let labelId = null;
              if (step === 1) {
                labelId = speakLabelingList[i].verbal_id;
              } else if (step === 2) {
                labelId = speakLabelingList[i].paraverbal_id;
              } else if (step === 3) {
                labelId = speakLabelingList[i].nonverbal_id;
              }
              if (labelId === currentSection.id) {
                beforeLabeling = speakLabelingList[i - 1] || null;
                afterLabeling = speakLabelingList[i + 1] || null;
              }
            }
          }

          if (currentSection.startTime > wavesurfer.getCurrentTime()) {
            let startTime = wavesurfer.getCurrentTime() * 1000;
            if (currentSection.id) {
              if (beforeLabeling && beforeLabeling.end_time >= startTime) {
                startTime = beforeLabeling.end_time;
              }
              if (step === 1) {
                const newLabelingList = allLabelingList.map((labeling) => {
                  if (labeling.verbal_id === currentSection.id) {
                    return {
                      ...labeling,
                      start_time: startTime,
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
                setLabelHistoryList([
                  ...newLabelingHistorySpliceList,
                  {
                    type: 'edit',
                    data: JSON.stringify(newLabelingList),
                    verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                    selectSpeaker,
                  },
                ]);
                setAllLabelingList(newLabelingList);
              } else if (step === 2) {
                let findLabeling = allLabelingList.find((item) => item.paraverbal_id === currentSection.id);
                if (!findLabeling) {
                  findLabeling = verbalLabelingList.find((item) => item.verbal_id === currentSection.id);
                  if (findLabeling) {
                    const newLabelingList = verbalLabelingList.map((labeling) => {
                      if (labeling.verbal_id === currentSection.id) {
                        return {
                          ...labeling,
                          start_time: startTime,
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

                    setLabelHistoryList([
                      ...newLabelingHistorySpliceList,
                      {
                        type: 'edit',
                        data: JSON.stringify(allLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                        verbal: JSON.stringify(newLabelingList),
                        selectSpeaker,
                      },
                    ]);

                    setVerbalLabelingList(newLabelingList);
                  }
                } else {
                  const newLabelingList = allLabelingList.map((labeling) => {
                    if (labeling.paraverbal_id === currentSection.id) {
                      return {
                        ...labeling,
                        start_time: startTime,
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
                  setLabelHistoryList([
                    ...newLabelingHistorySpliceList,
                    {
                      type: 'edit',
                      data: JSON.stringify(newLabelingList),
                      verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                      selectSpeaker,
                    },
                  ]);
                  setAllLabelingList(allLabelingList.map((item) => (item.paraverbal_id === currentSection.id ? { ...item, start_time: startTime } : item)));
                }
              } else if (step === 3) {
                let findLabeling = allLabelingList.find((item) => item.nonverbal_id === currentSection.id);
                if (!findLabeling) {
                  findLabeling = verbalLabelingList.find((item) => item.verbal_id === currentSection.id);
                  if (findLabeling) {
                    const newLabelingList = verbalLabelingList.map((labeling) => {
                      if (labeling.verbal_id === currentSection.id) {
                        return {
                          ...labeling,
                          start_time: startTime,
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

                    setLabelHistoryList([
                      ...newLabelingHistorySpliceList,
                      {
                        type: 'edit',
                        data: JSON.stringify(allLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                        verbal: JSON.stringify(newLabelingList),
                        selectSpeaker,
                      },
                    ]);

                    setVerbalLabelingList(newLabelingList);
                  }
                } else {
                  const newLabelingList = allLabelingList.map((labeling) => {
                    if (labeling.nonverbal_id === currentSection.id) {
                      return {
                        ...labeling,
                        start_time: startTime,
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
                  setLabelHistoryList([
                    ...newLabelingHistorySpliceList,
                    {
                      type: 'edit',
                      data: JSON.stringify(newLabelingList),
                      verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                      selectSpeaker,
                    },
                  ]);
                  setAllLabelingList(allLabelingList.map((item) => (item.nonverbal_id === currentSection.id ? { ...item, start_time: startTime } : item)));
                }
              }
            }
            setCurrentSection({
              ...currentSection,
              startTime: startTime / 1000,
            });
            setTimeout(() => {
              setTime(startTime);
              setSeekingTime(startTime / 1000);
            }, 0);
          } else {
            let endTime = wavesurfer.getCurrentTime() * 1000;
            if (currentSection.id) {
              if (afterLabeling && afterLabeling.start_time <= endTime) {
                endTime = afterLabeling.start_time;
              }
              if (step === 1) {
                const newLabelingList = allLabelingList.map((labeling) => {
                  if (labeling.verbal_id === currentSection.id) {
                    return {
                      ...labeling,
                      end_time: endTime,
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
                setAllLabelingList(newLabelingList);
              } else if (step === 2) {
                let findLabeling = allLabelingList.find((item) => item.paraverbal_id === currentSection.id);
                if (!findLabeling) {
                  findLabeling = verbalLabelingList.find((item) => item.verbal_id === currentSection.id);
                  if (findLabeling) {
                    const newLabelingList = verbalLabelingList.map((labeling) => {
                      if (labeling.verbal_id === currentSection.id) {
                        return {
                          ...labeling,
                          end_time: endTime,
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
                    setLabelHistoryList([
                      ...newLabelingHistorySpliceList,
                      {
                        type: 'edit',
                        data: JSON.stringify(allLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                        verbal: JSON.stringify(newLabelingList),
                        selectSpeaker,
                      },
                    ]);
                    setVerbalLabelingList(newLabelingList);
                  }
                } else {
                  const newLabelingList = allLabelingList.map((labeling) => {
                    if (labeling.paraverbal_id === currentSection.id) {
                      return {
                        ...labeling,
                        end_time: endTime,
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
                  setLabelHistoryList([
                    ...newLabelingHistorySpliceList,
                    {
                      type: 'edit',
                      data: JSON.stringify(newLabelingList),
                      verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                      selectSpeaker,
                    },
                  ]);
                  setAllLabelingList(newLabelingList);
                }
              } else if (step === 3) {
                let findLabeling = allLabelingList.find((item) => item.nonverbal_id === currentSection.id);
                if (!findLabeling) {
                  findLabeling = verbalLabelingList.find((item) => item.verbal_id === currentSection.id);
                  if (findLabeling) {
                    const newLabelingList = verbalLabelingList.map((labeling) => {
                      if (labeling.verbal_id === currentSection.id) {
                        return {
                          ...labeling,
                          end_time: endTime,
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

                    setLabelHistoryList([
                      ...newLabelingHistorySpliceList,
                      {
                        type: 'edit',
                        data: JSON.stringify(allLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                        verbal: JSON.stringify(newLabelingList),
                        selectSpeaker,
                      },
                    ]);

                    setVerbalLabelingList(newLabelingList);
                  }
                } else {
                  const newLabelingList = allLabelingList.map((labeling) => {
                    if (labeling.nonverbal_id === currentSection.id) {
                      return {
                        ...labeling,
                        end_time: endTime,
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
                  setLabelHistoryList([
                    ...newLabelingHistorySpliceList,
                    {
                      type: 'edit',
                      data: JSON.stringify(newLabelingList),
                      verbal: JSON.stringify(verbalLabelingList.map((labeling) => ({ ...labeling, active: false, selected: false }))),
                      selectSpeaker,
                    },
                  ]);
                  setAllLabelingList(newLabelingList);
                }
              }
            }
            setTimeout(() => {
              setTime(currentSection.startTime * 1000);
              setSeekingTime(currentSection.startTime);
            }, 0);
            setCurrentSection({
              ...currentSection,
              endTime: endTime / 1000,
            });
          }
        } else {
          if (seekingTime < wavesurfer.getCurrentTime()) {
            setCurrentSection({
              id: '',
              startTime: seekingTime,
              endTime: wavesurfer.getCurrentTime(),
            });
          } else {
            // setTimeout(() => {
            //   setTime(wavesurfer.getCurrentTime() * 1000.0);
            // }, 0);
            setCurrentSection({
              id: '',
              startTime: wavesurfer.getCurrentTime(),
              endTime: seekingTime,
            });
          }
        }
      }
    });

    wavesurfer.on('seeking', (t) => {
      setSeekingTime(t);
    });

    // Throttle scroll -> Recoil writes using rAF
    let scrollScheduled = false as boolean;
    let pendingScrollLeft = 0 as number;
    const scheduleScrollCommit = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        setScrollLeft(pendingScrollLeft);
        scrollScheduled = false;
      });
    };
    wavesurfer.on('scroll', () => {
      pendingScrollLeft = wavesurfer?.getScroll() ?? 0;
      scheduleScrollCommit();
    });

    // duration을 갱신한다.
    wavesurfer.on('ready', () => {
      const durationVal = wavesurfer.getDuration();
      const scrollWidthVal = wavesurfer?.getWrapper().scrollWidth ?? 0;
      // Batch state updates off the critical path
      requestAnimationFrame(() => {
        setLoading(false);
        setDuration(durationVal);
        setScrollWidth(scrollWidthVal);
        wavesurfer.setTime(seekingTime);
        setTime(0);
        setIsPlaying(false);
      });
    });

    return () => {
      wavesurfer.unAll();
    };
  }, [
    setDuration,
    setIsPlaying,
    setScrollLeft,
    setScrollWidth,
    setTime,
    wavesurfer,
    wsRegions,
    seekingTime,
    isInputOpenId,
    allLabelingList,
    setSeekingTime,
    setSelectedSection,
    setIsInputOpenId,
    setAllLabelingList,
    setLoading,
    setCurrentSection,
    shiftKey,
    currentSection,
    step,
    labelHistoryList,
    labelHistoryIndex,
    setLabelHistoryList,
    selectSpeaker,
    verbalLabelingList,
    setVerbalLabelingList,
  ]);

  useEffect(() => {
    if (!wavesurfer) return;
    // drag 색상 및 영역 설정
    wsRegions?.enableDragSelection({
      color: 'rgba(51, 64, 168, 0.4)',
    });
    wsRegions?.on('region-created', (region) => {
      setIsReplay(false);
      wavesurfer.pause();

      setCurrentSection({
        id: '',
        startTime: region.start,
        endTime: region.end,
      });

      setSelectedSection([]);

      setSeekingTime(region.start);

      region.remove();
    });
  }, [setCurrentSection, setIsReplay, setSeekingTime, wavesurfer, wsRegions]);

  useEffect(() => {
    if (!wavesurfer) return;
    wsRegions?.on('region-created', () => {
      if (isInputOpenId) {
        const span = document.getElementById(isInputOpenId);
        if (span) {
          // span 요소가 포커스를 받을 수 있도록 설정
          // span.setAttribute('tabindex', '-1');
          // span.focus();

          // enter 키 이벤트 생성
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13, // Enter key code
            code: 'Enter',
            which: 13,
            bubbles: true,
            cancelable: true,
          });

          // 이벤트를 span 요소에 디스패치
          span.dispatchEvent(enterEvent);

          // blur 이벤트 생성 및 디스패치
          const blurEvent = new Event('blur', {
            bubbles: true,
            cancelable: true,
          });
          span.dispatchEvent(blurEvent);
        }
      }
    });
  }, [wavesurfer, wsRegions, isInputOpenId]);

  // 줌인 줌아웃
  const handleSelectZoom = (item: IOption) => {
    setZoom(Number(item.value));
  };

  // 속도 변경
  const handleSelectSpeed = (item: IOption) => {
    setSpeed(Number(item.value));
  };

  // 줌아웃
  const handleZoomOut = () => {
    if (zoom === 50) {
      return;
    }
    setZoom(zoom - 25);
  };

  // 줌인
  const handleZoomIn = () => {
    if (zoom === 250) {
      return;
    }
    setZoom(zoom + 25);
  };

  return (
    <WaveShaperPlayerWrapper>
      <div className="audio-option">
        <ZoomOut width="20" height="20" color={theme.workerColor.line2} onClick={handleZoomOut} />
        <Select
          size="s"
          className="zoom-select"
          list={zoomList}
          onClick={(item: IOption) => handleSelectZoom(item)}
          selectOption={{
            value: zoom.toString(),
            name: `${zoom.toString()}%`,
          }}
        />
        <ZoomIn width="20" height="20" color={theme.workerColor.line2} onClick={handleZoomIn} />
        <Select
          size="s"
          className="speed-select"
          list={speedList}
          onClick={(item: IOption) => handleSelectSpeed(item)}
          selectOption={speedList.find((item) => item.value === speed) ?? speedList[0]}
        />
      </div>
      {/** zIndex 수정하면 스크롤이안되서 요렇게수정 */}
      <div id="waveform" ref={waveformRef} style={{ width: '1485px', zIndex: 1000, position: 'relative' }} />
    </WaveShaperPlayerWrapper>
  );
};

export default WaveShaperPlayer;
