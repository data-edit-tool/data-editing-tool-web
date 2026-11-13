import { useEffect, useRef } from 'react';
import useWavesurfer from 'hooks/useWaveSuffer';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import durationAtom from 'state/duration.atom';
import { isPlayAtom } from 'state/isPlay.atom';
import { repeatAgainAtom, repeatAtom } from 'state/repeat.atom';
import { scrollLeftAtom } from 'state/scrollLeft.atom';
import { scrollWidthAtom } from 'state/scrollWidth.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { speedAtom } from 'state/speed.atom';
import { timeAtom } from 'state/time.atom';
import { viewerJobFileSelectAudioIdSelector } from 'state/viewer-job-file-list';
import { viewerVerbalListSelector } from 'state/viewer-labeling';
import { viewerLoadingSelector, viewerWaveformReadySelector } from 'state/viewer-loading';
import { zoomAtom } from 'state/zoom.atom';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { IOption } from 'types/interface';

import Select from 'components/Common/Worker/Select';
import ZoomIn from 'components/SVG/Icon/ZoomIn';
import ZoomOut from 'components/SVG/Icon/ZoomOut';

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

const ViewerWaveShaperPlayer = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useRecoilState(zoomAtom);
  const [time, setTime] = useRecoilState(timeAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayAtom);
  const [speed, setSpeed] = useRecoilState(speedAtom);
  const setDuration = useSetRecoilState(durationAtom);
  const setScrollWidth = useSetRecoilState(scrollWidthAtom);
  const setScrollLeft = useSetRecoilState(scrollLeftAtom);
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const setSelectedSection = useSetRecoilState(selectedSectionAtom);
  const [isReplay, setIsReplay] = useRecoilState(repeatAtom);
  const [replayAgain, setReplayAgain] = useRecoilState<boolean>(repeatAgainAtom);
  const [seekingTime, setSeekingTime] = useRecoilState(seekingTimeAtom);
  const [currentSection, setCurrentSection] = useRecoilState(currentSectionAtom);

  const selectAudio = useRecoilValue(viewerJobFileSelectAudioIdSelector);
  const loading = useRecoilValue(viewerLoadingSelector);
  const setWaveformReady = useSetRecoilState(viewerWaveformReadySelector);
  const waveformReady = useRecoilValue(viewerWaveformReadySelector);
  const [verbalLabelingList, setVerbalLabelingList] = useRecoilState(viewerVerbalListSelector);

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
    // 오디오가 바뀌면 웨이브서퍼 다시 재로딩
    if (!wavesurfer) return;

    setWaveformReady(false);

    const url = selectAudio?.file_url;
    if (!url) return;

    wavesurfer.load(url);
  }, [selectAudio, wavesurfer, setWaveformReady]);

  useEffect(() => {
    // 초기 줌상태
    if (loading || !wavesurfer || !waveformReady) return;
    if (wavesurfer.getDuration() === 0) return;

    try {
      wavesurfer.zoom(zoom);
    } catch {
      return;
    }

    setScrollWidth(wavesurfer?.getWrapper().scrollWidth ?? 0);
  }, [setScrollWidth, wavesurfer, zoom, loading, waveformReady]);

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

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setTime(seekingTime);
    }
  }, [seekingTime, wavesurfer]);

  useEffect(() => {
    if (isReplay && wavesurfer && replayAgain) {
      setReplayAgain(false);
      wavesurfer.setTime(currentSection?.startTime ?? 0);
      setSeekingTime(currentSection?.startTime ?? 0);
      wavesurfer.play();
    }
  }, [wavesurfer, isReplay, currentSection, replayAgain, setReplayAgain, setSeekingTime]);

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
      setSelectedSection([]);
      setCurrentSection(null);
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
        setWaveformReady(true);
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
    setSeekingTime,
    setSelectedSection,
    setWaveformReady,
    setCurrentSection,
    currentSection,
    verbalLabelingList,
    setVerbalLabelingList,
  ]);

  // Sync wavesurfer scroll position when the shared scroll state changes (e.g., from AutoScroll)
  useEffect(() => {
    if (!wavesurfer) return;
    // Wavesurfer's actual scrollable element lives inside the renderer
    const scrollEl =
      // @ts-expect-error wavesurfer.renderer is not public in types but exists at runtime
      wavesurfer.renderer?.scrollContainer ?? wavesurfer.getWrapper()?.parentElement;
    if (!scrollEl) return;
    if (Math.abs(scrollEl.scrollLeft - scrollLeft) < 1) return;
    scrollEl.scrollLeft = scrollLeft;
  }, [scrollLeft, wavesurfer]);

  useEffect(() => {
    return () => {
      setWaveformReady(false);
    };
  }, [setWaveformReady]);

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
    <WaveShaperPlayerWrapper style={{ visibility: loading ? 'hidden' : 'visible' }}>
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

export default ViewerWaveShaperPlayer;
