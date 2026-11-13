/* eslint-disable indent */
import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import useVideoPlayer from 'hooks/useVideoPlayer';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionAtom } from 'state/current-section.atom';
import { repeatAgainAtom, repeatAtom } from 'state/repeat.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { selectedSectionAtom } from 'state/selected-section.atom';
import { workerJobFileSelectVideoIdSelector } from 'state/worker-job-file-list';
import { workerLoadingSelector } from 'state/worker-loading';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { debounce } from 'utils/debounce';
import { formatTime } from 'utils/time-format';

import BackForward1 from 'components/SVG/Icon/BackForward';
import BackForward01 from 'components/SVG/Icon/BackForward0-1';
import Check from 'components/SVG/Icon/Check';
import Contract from 'components/SVG/Icon/Contract';
import Expand from 'components/SVG/Icon/Expand';
import FastForward01 from 'components/SVG/Icon/FastForward0-1';
import FastForward1 from 'components/SVG/Icon/FastForward1';
import Pause from 'components/SVG/Icon/Pause';
import Play from 'components/SVG/Icon/Play';
import Repeat from 'components/SVG/Icon/Repeat';
import SpeedOn from 'components/SVG/Icon/SpeedOn';

const PopupVideoPlayer = styled.div`
  position: absolute;
  z-index: 6000;
  width: 861px;
  height: 606px;
  min-width: 861px;
  min-height: 606px;
  padding: 1px;
  border-radius: 6px;
  .resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: transparent;
    cursor: pointer;
  }

  .resize-handle-right {
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    cursor: e-resize;
  }

  .resize-handle-left {
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    cursor: w-resize;
  }

  .resize-handle-top {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    cursor: n-resize;
  }

  .resize-handle-bottom {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    cursor: s-resize;
  }

  .resize-handle-bottom-right {
    bottom: 0;
    right: 0;
    cursor: se-resize;
  }

  .resize-handle-bottom-left {
    bottom: 0;
    left: 0;
    cursor: sw-resize;
  }

  .resize-handle-top-right {
    top: 0;
    right: 0;
    cursor: ne-resize;
  }

  .resize-handle-top-left {
    top: 0;
    left: 0;
    cursor: nw-resize;
  }
  .popup-video-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background-color: #141519;
    .video-header {
      text-align: center;
      width: 100%;
      cursor: pointer;
      background-color: #151b27;
      position: relative;
      .video-title {
        display: inline-block;
        font-size: ${({ theme }) => theme.fontSize.text_16};
        color: ${({ theme }) => theme.workerColor.white};
        font-weight: 500;
        padding: 11px 0px;
        max-width: 400px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        user-select: none;
      }
      .video-close {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        /* create close */
        width: 14px;
        height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .close {
        position: absolute;
        right: 11px;
        top: 7px;
        width: 24px;
        height: 24px;
      }
      .close:before,
      .close:after {
        position: absolute;
        left: 11px;
        top: 3px;
        content: ' ';
        height: 20px;
        width: 2px;
        background-color: ${({ theme }) => theme.workerColor.white};
      }
      .close:before {
        transform: rotate(45deg);
      }
      .close:after {
        transform: rotate(-45deg);
      }
    }
    .video-body {
      border: 1px solid ${({ theme }) => theme.workerColor.line2};
      background-color: #141519;
      display: flex;
      flex-direction: column;
      height: calc(100% - 38px);
      .video-wrapper {
        position: relative;

        video {
          width: 100%;
        }
        .video-speed-popup {
          position: absolute;
          width: 134px;
          background-color: rgba(0, 0, 0, 0.84);
          bottom: 10px;
          left: 10px;
          .speed-title {
            text-align: center;
            color: ${({ theme }) => theme.workerColor.white};
            font-size: 13px;
            padding: 11px 0px;
            border-bottom: 1px solid #4f5056;
            line-height: 17px;
          }
          ul {
            margin-top: 10px;
            li {
              padding: 6px 0px 6px 30px;
              color: ${({ theme }) => theme.workerColor.white};
              font-size: 13px;
              line-height: 18px;
              cursor: pointer;
              position: relative;
              &:hover,
              &.active {
                background-color: rgba(255, 255, 255, 0.17);
              }
              svg {
                position: absolute;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
              }
            }
          }
        }
        .tool-tip {
          position: absolute;
          bottom: 10px;
          background-color: rgba(0, 0, 0, 0.84);
          text-align: center;
          padding: 7px 8px;
          font-size: ${({ theme }) => theme.fontSize.text_12};
          border-radius: 4px;
          line-height: 16px;
        }
      }
      .video-option-wrapper {
        margin: auto 0;
        .video-timeline {
          margin-top: 4px;
          color: ${({ theme }) => theme.workerColor.line2};
          font-size: 17px;
          text-align: center;
        }
        .video-option-wrapper {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0px 10px;
          .video-option-left {
            display: flex;
            width: 108px;
            .speed-on {
              width: 46px;
              height: 46px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 6px;
              cursor: pointer;
              &:hover,
              &.active {
                background-color: ${({ theme }) => theme.workerColor.secondary};
              }
            }
          }
          ul {
            display: flex;
            li {
              margin-right: 16px;
              width: 46px;
              height: 46px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 6px;
              cursor: pointer;
              &:hover,
              &.active,
              &:active {
                background-color: ${({ theme }) => theme.workerColor.secondary};
              }
              &:last-child {
                margin-right: 0px;
              }
            }
          }
          .video-right-option {
            display: flex;
            .expend {
              width: 46px;
              height: 46px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 6px;
              margin-right: 16px;
              cursor: pointer;
              &:hover,
              &.active {
                background-color: ${({ theme }) => theme.workerColor.secondary};
              }
            }
            .repeat {
              width: 46px;
              height: 46px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 6px;
              cursor: pointer;
              &:hover,
              &.active {
                background-color: ${({ theme }) => theme.workerColor.secondary};
              }
            }
          }
        }
      }
    }
  }
`;

const VideoPlayerWrapper = styled.div`
  width: 536px;
  .video-wrapper {
    position: relative;
    video {
      width: 100%;
    }
    .video-speed-popup {
      position: absolute;
      width: 134px;
      background-color: rgba(0, 0, 0, 0.84);
      bottom: 10px;
      left: 10px;
      .speed-title {
        text-align: center;
        color: ${({ theme }) => theme.workerColor.white};
        font-size: 13px;
        padding: 11px 0px;
        border-bottom: 1px solid #4f5056;
        line-height: 17px;
      }
      ul {
        margin-top: 10px;
        li {
          padding: 6px 0px 6px 30px;
          color: ${({ theme }) => theme.workerColor.white};
          font-size: 13px;
          line-height: 18px;
          cursor: pointer;
          position: relative;
          &:hover,
          &.active {
            background-color: rgba(255, 255, 255, 0.17);
          }
          svg {
            position: absolute;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
          }
        }
      }
    }
    .tool-tip {
      position: absolute;
      bottom: 10px;
      background-color: rgba(0, 0, 0, 0.84);
      text-align: center;
      padding: 7px 8px;
      font-size: ${({ theme }) => theme.fontSize.text_12};
      border-radius: 4px;
      line-height: 16px;
    }
  }
  .video-timeline {
    margin-top: 2px;
    color: ${({ theme }) => theme.workerColor.line2};
    font-size: 11px;
    text-align: center;
  }
  .video-option-wrapper {
    margin-top: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    .video-option-left {
      display: flex;
      width: 74px;
      .speed-on {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        cursor: pointer;
        &:hover,
        &.active {
          background-color: ${({ theme }) => theme.workerColor.secondary};
        }
      }
    }
    ul {
      display: flex;
      li {
        margin-right: 16px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        cursor: pointer;
        &:hover,
        &.active,
        &:active {
          background-color: ${({ theme }) => theme.workerColor.secondary};
        }
        &:last-child {
          margin-right: 0px;
        }
      }
    }
    .video-right-option {
      display: flex;
      .expend {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        margin-right: 16px;
        cursor: pointer;
        &:hover,
        &.active {
          background-color: ${({ theme }) => theme.workerColor.secondary};
        }
      }
      .repeat {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        cursor: pointer;
        &:hover,
        &.active {
          background-color: ${({ theme }) => theme.workerColor.secondary};
        }
      }
    }
  }
`;

const speedList = [
  {
    value: 0.5,
    name: '0.5',
  },
  {
    value: 0.75,
    name: '0.75',
  },
  {
    value: 1,
    name: '1(권장)',
  },
  {
    value: 1.25,
    name: '1.25',
  },
  {
    value: 1.5,
    name: '1.5',
  },
  {
    value: 1.75,
    name: '1.75',
  },
  {
    value: 2,
    name: '2',
  },
];

const VideoPlayer = () => {
  const videoFile = useRecoilValue(workerJobFileSelectVideoIdSelector);
  const { videoRef, popupVideoRef, time, isPlaying, handlePlay, handlePause, plusTime, minusTime, handleSpeedChange, speed } = useVideoPlayer();

  const selectedSection = useRecoilValue(selectedSectionAtom);
  const currentSection = useRecoilValue(currentSectionAtom);
  const setReplay = useSetRecoilState<boolean>(repeatAtom);
  const [replayAgain, setReplayAgain] = useRecoilState<boolean>(repeatAgainAtom);
  const loading = useRecoilValue(workerLoadingSelector);
  const [isSpeedControl, setIsSpeedControl] = useState(false);
  const [toolTip, setToolTip] = useState({
    open: false,
    text: '',
    right: 0,
  });
  const [popupToolTip, setPopupToolTip] = useState({
    open: false,
    text: '',
    right: 0,
  });
  const seekingTime = useRecoilValue(seekingTimeAtom);
  const [isPopupVideoOpen, setIsPopupVideoOpen] = useState(false);
  const popupVideoResizeRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 861, height: 606, left: 16, top: 100 });
  const [initialDimensions, setInitialDimensions] = useState<any>(null);
  const [resizing, setResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!loading && videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    if (!loading && popupVideoRef.current) {
      popupVideoRef.current.playbackRate = speed;
    }
  }, [videoRef.current, popupVideoRef.current, loading]);

  // 헤더 움직이기 전 좌표 저장
  const handleTitleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as any).closest('.close')) {
      return;
    }
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - dimensions.left,
      y: e.clientY - dimensions.top,
    });
  };

  // 헤더 마우스 뗏을때
  const handleTitleMouseUp = () => {
    setIsDragging(false);
  };

  // 헤더 움직일때
  const handleTitleMouseMove = debounce((e) => {
    if (!isDragging) return; // 드래그 중이 아니면 종료
    setDimensions((prevDimensions) => {
      if (e.clientX - dragOffset.x < 0) {
        return {
          ...prevDimensions,
          left: 0,
        };
      }
      if (e.clientY - dragOffset.y < 0) {
        return {
          ...prevDimensions,
          top: 0,
        };
      }
      if (e.clientX - dragOffset.x + prevDimensions.width > 1900) {
        return {
          ...prevDimensions,
          left: window.innerWidth - prevDimensions.width + 100,
        };
      }
      // if (e.clientY - dragOffset.y + prevDimensions.height > window.innerHeight) {
      //   return {
      //     ...prevDimensions,
      //     top: window.innerHeight - prevDimensions.height,
      //   };
      // }
      return {
        ...prevDimensions,
        left: e.clientX - dragOffset.x,
        top: e.clientY - dragOffset.y,
      };
    });
  }, 10);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleTitleMouseMove);
      window.addEventListener('mouseup', handleTitleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleTitleMouseMove);
      window.removeEventListener('mouseup', handleTitleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleTitleMouseMove);
      window.removeEventListener('mouseup', handleTitleMouseUp);
    };
  }, [isDragging]);

  // 비디오 크기 조절 시작
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault();
    const popupVideoWrapper = popupVideoRef.current;
    const rect = popupVideoWrapper?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setInitialDimensions({
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: rect.width,
      initialHeight: rect.height,
      initialLeft: rect.left,
      initialTop: rect.top - 42.5,
      direction,
    });
    setResizing(true);
  };

  // 비디오 크기 조절
  const handleMouseMove = (e: MouseEvent) => {
    if (!resizing) return;

    const { startX, initialWidth, initialLeft, direction } = initialDimensions;
    const dx = e.clientX - startX;

    // 대각선들 예외처리
    switch (direction) {
      case 'bottom-right':
        setDimensions((dims) => {
          const currentRatio = dims.width / dims.height;
          const newWidth = Math.max(861, initialWidth + dx);
          const newHeight = newWidth / currentRatio;
          if (newWidth === 861 || newHeight === 606 || dims.top < 0 || dims.left < 0) {
            return dims;
          }
          if (dims.left + newWidth > 1900) {
            return dims;
          }
          return {
            ...dims,
            width: newWidth,
            height: Math.max(606, newHeight),
          };
        });
        break;
      case 'bottom-left':
        setDimensions((dims) => {
          const currentRatio = dims.width / dims.height;
          const newWidth = Math.max(861, initialWidth - dx);
          const newHeight = newWidth / currentRatio;
          if (newWidth === 861 || newHeight === 606) {
            return dims;
          }
          if (initialLeft + dx < 0) {
            return dims;
          }
          if (dims.top + newHeight > window.innerHeight) {
            return dims;
          }
          return {
            ...dims,
            width: newWidth,
            height: Math.max(606, newHeight),
            left: initialLeft + dx,
          };
        });
        break;
      case 'top-right':
        setDimensions((dims) => {
          const currentRatio = dims.width / dims.height;
          const newWidth = Math.max(861, initialWidth + dx);
          const newHeight = newWidth / currentRatio;

          if (newWidth === 861 || newHeight === 606) {
            return dims;
          }

          const newTop = dims.top - (newHeight - dims.height); // 상단 위치 조정

          if (newTop < 0) {
            return dims;
          }

          return {
            ...dims,
            width: newWidth,
            height: Math.max(606, newHeight),
            top: newTop,
          };
        });
        break;
      case 'top-left':
        setDimensions((dims) => {
          const currentRatio = dims.width / dims.height;
          const newWidth = Math.max(861, initialWidth - dx);
          const newHeight = newWidth / currentRatio;
          if (newWidth === 861 || newHeight === 606) {
            return dims;
          }
          if (initialLeft + dx < 0) {
            return dims;
          }
          const newTop = dims.top - (newHeight - dims.height); // 상단 위치 조정
          if (newTop < 0) {
            return dims;
          }
          return {
            ...dims,
            width: newWidth,
            height: Math.max(606, newHeight),
            left: initialLeft + dx,
            top: newTop,
          };
        });
        break;
      default:
        break;
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
  };

  const handleMouseMoveDebounced = debounce(handleMouseMove, 10);

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleMouseMoveDebounced);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMoveDebounced);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveDebounced);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  useEffect(() => {
    // 비디오 싱크 맞추기
    if (videoRef.current) {
      videoRef.current.currentTime = seekingTime;
    }
    if (popupVideoRef.current) {
      popupVideoRef.current.currentTime = seekingTime;
    }
  }, [seekingTime, videoRef, popupVideoRef, replayAgain]);

  // 구간 재생
  const handleRepeat = useCallback(() => {
    if (!currentSection) {
      return;
    }
    // 구간재생 코드 수정해야함 (임시)
    if (currentSection.startTime === 0 && currentSection.endTime === 0) {
      return;
    }
    setReplay(true);
    setReplayAgain(true);
  }, [currentSection, setReplay, setReplayAgain]);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (
        !loading &&
        !(document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SPAN' || document.activeElement?.tagName === 'TEXTAREA')
      ) {
        if (e.keyCode === 32 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          e.preventDefault();
          if (isPlaying) {
            handlePause();
          } else {
            handlePlay();
          }
        } else if (e.keyCode === 82 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          handleRepeat();
        } else if (e.keyCode === 39 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          e.preventDefault();
          plusTime(1);
        } else if (e.keyCode === 37 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          e.preventDefault();
          minusTime(1);
        } else if (e.keyCode === 39 && !e.ctrlKey && !e.altKey && e.shiftKey && !e.metaKey) {
          e.preventDefault();
          plusTime(0.1);
        } else if (e.keyCode === 37 && !e.ctrlKey && !e.altKey && e.shiftKey && !e.metaKey) {
          e.preventDefault();
          minusTime(0.1);
        } else if (e.keyCode === 38 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          e.preventDefault();
          const newSpeed = speed + 0.25;
          if (newSpeed <= 2) {
            handleSpeedChange(newSpeed);
          }
        } else if (e.keyCode === 40 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          e.preventDefault();
          const newSpeed = speed - 0.25;
          if (newSpeed >= 0.5) {
            handleSpeedChange(newSpeed);
          }
        }
      }
    };

    document.addEventListener('keydown', handleShortcut);

    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, [handlePause, handlePlay, handleRepeat, handleSpeedChange, isPlaying, loading, minusTime, plusTime, selectedSection, speed, currentSection]);

  // 재생속도 변경
  const handleSpeed = () => {
    setIsSpeedControl((prev) => !prev);
    handleBlur();
  };

  // 재생속도 변경
  const handlePopupSpeed = () => {
    setIsSpeedControl((prev) => !prev);
    handlePopupBlur();
  };

  // 시간 이동 (-1, -0.1)
  const handleMinusTime = (backTime: number) => {
    minusTime(backTime);
  };

  // 시간 이동 (+1, +0.1)
  const handlePlusTime = (forwardTime: number) => {
    plusTime(forwardTime);
  };

  // 속도 변경
  const handleSpeedControl = (item: (typeof speedList)[0]) => {
    setIsSpeedControl(false);
    handleSpeedChange(item.value);
  };

  // 아이콘 포커스 했을 경우 툴팁
  const handleFocus = (type: string) => {
    if (type === 'repeat') {
      setToolTip({
        open: true,
        text: '구간 반복 재생',
        right: 10,
      });
    } else if (type === 'expend') {
      setToolTip({
        open: true,
        text: '큰 화면',
        right: 46,
      });
    } else if (type === 'fastForward1') {
      setToolTip({
        open: true,
        text: '빨리 감기(1s)',
        right: 136,
      });
    } else if (type === 'fastForward01') {
      setToolTip({
        open: true,
        text: '빨리 감기(0.1s)',
        right: 176,
      });
    } else if (type === 'play' || type === 'pause') {
      setToolTip({
        open: true,
        text: type === 'play' ? '재생' : '일시정지',
        right: type === 'play' ? 250 : 240,
      });
    } else if (type === 'backForward01') {
      setToolTip({
        open: true,
        text: '뒤로 감기(0.1s)',
        right: 270,
      });
    } else if (type === 'backForward1') {
      setToolTip({
        open: true,
        text: '뒤로 감기(1s)',
        right: 320,
      });
    } else if (type === 'speed') {
      if (!isSpeedControl) {
        setToolTip({
          open: true,
          text: '속도 설정',
          right: 2000,
        });
      }
    }
  };

  // 아이콘 포커스 했을 경우 툴팁
  const handlePopupFocus = (type: string) => {
    if (type === 'repeat') {
      setPopupToolTip({
        open: true,
        text: '구간 반복 재생',
        right: 10,
      });
    } else if (type === 'contract') {
      setPopupToolTip({
        open: true,
        text: '큰 화면 종료',
        right: 58,
      });
    } else if (type === 'fastForward1') {
      setPopupToolTip({
        open: true,
        text: '빨리 감기(1s)',
        right: 255,
      });
    } else if (type === 'fastForward01') {
      setPopupToolTip({
        open: true,
        text: '빨리 감기(0.1s)',
        right: 315,
      });
    } else if (type === 'play' || type === 'pause') {
      setPopupToolTip({
        open: true,
        text: type === 'play' ? '재생' : '일시정지',
        right: type === 'play' ? 401 : 394,
      });
    } else if (type === 'backForward01') {
      setPopupToolTip({
        open: true,
        text: '뒤로 감기(0.1s)',
        right: 440,
      });
    } else if (type === 'backForward1') {
      setPopupToolTip({
        open: true,
        text: '뒤로 감기(1s)',
        right: 505,
      });
    } else if (type === 'speed') {
      if (!isSpeedControl) {
        setPopupToolTip({
          open: true,
          text: '속도 설정',
          right: 780,
        });
      }
    }
  };

  // 아이콘에서 벗어날경우
  const handleBlur = () => {
    setToolTip({
      open: false,
      text: '',
      right: 0,
    });
  };

  // 아이콘에서 벗어날경우
  const handlePopupBlur = () => {
    setPopupToolTip({
      open: false,
      text: '',
      right: 0,
    });
  };

  const handleContentMenuVideo = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
    e.preventDefault();
  };

  const handleExpand = () => {
    setDimensions({
      width: 861,
      height: 606,
      left: 16,
      top: 100,
    });
    setDragOffset({ x: 0, y: 0 });
    setIsPopupVideoOpen(true);
  };

  const handleContract = () => {
    setIsPopupVideoOpen(false);
  };

  const handleClose = () => {
    setIsPopupVideoOpen(false);
  };

  return (
    <>
      <PopupVideoPlayer
        style={{
          display: isPopupVideoOpen ? 'block' : 'none',
          position: 'absolute',
          width: dimensions.width,
          height: dimensions.height,
          left: dimensions.left,
          top: dimensions.top,
        }}
        ref={popupVideoResizeRef}
      >
        <div className="popup-video-wrapper">
          <div className="video-header" onMouseDown={handleTitleMouseDown}>
            <span className="video-title">{videoFile?.file_name}</span>
            <div className="close" onClick={handleClose} />
          </div>
          <div className="video-body">
            <div className="video-wrapper">
              {videoFile && (
                <video
                  muted
                  controls={false}
                  style={{ width: '100%' }}
                  ref={popupVideoRef}
                  src={videoFile.file_url}
                  crossOrigin="anonymous"
                  onContextMenu={handleContentMenuVideo}
                />
              )}
              {isSpeedControl && (
                <div className="video-speed-popup">
                  <div className="speed-title">재생 속도 설정</div>
                  <ul>
                    {speedList.map((item) => (
                      <li key={`speed-${item.value}`} className={classNames({ active: item.value === speed })} onClick={() => handleSpeedControl(item)}>
                        {item.value === speed && <Check width="10" height="10" color={theme.workerColor.white} />}
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {popupToolTip.open && (
                <div className="tool-tip" style={{ right: popupToolTip.right }}>
                  {popupToolTip.text}
                </div>
              )}
            </div>
            <div className="video-option-wrapper">
              <div className="video-timeline">{formatTime(time)}</div>
              <div className="video-option-wrapper">
                <div className="video-option-left">
                  <div className="speed-on" onClick={handlePopupSpeed} onMouseEnter={() => handlePopupFocus('speed')} onMouseLeave={handlePopupBlur}>
                    <SpeedOn width="38" height="38" color={theme.workerColor.line2} />
                  </div>
                </div>
                <ul>
                  <li onClick={() => handleMinusTime(1)} onMouseEnter={() => handlePopupFocus('backForward1')} onMouseLeave={handlePopupBlur}>
                    <BackForward1 width="38" height="38" color={theme.workerColor.line2} />
                  </li>
                  <li onClick={() => handleMinusTime(0.1)} onMouseEnter={() => handlePopupFocus('backForward01')} onMouseLeave={handlePopupBlur}>
                    <BackForward01 width="38" height="38" color={theme.workerColor.line2} />
                  </li>
                  <li>
                    {isPlaying ? (
                      <Pause
                        width="38"
                        height="38"
                        color={theme.workerColor.line2}
                        onClick={handlePause}
                        onMouseEnter={() => handlePopupFocus('pause')}
                        onMouseLeave={handlePopupBlur}
                      />
                    ) : (
                      <Play
                        width="38"
                        height="38"
                        color={theme.workerColor.line2}
                        onClick={handlePlay}
                        onMouseEnter={() => handlePopupFocus('play')}
                        onMouseLeave={handlePopupBlur}
                      />
                    )}
                  </li>
                  <li onClick={() => handlePlusTime(0.1)} onMouseEnter={() => handlePopupFocus('fastForward01')} onMouseLeave={handlePopupBlur}>
                    <FastForward01 width="38" height="38" color={theme.workerColor.line2} />
                  </li>
                  <li onClick={() => handlePlusTime(1)} onMouseEnter={() => handlePopupFocus('fastForward1')} onMouseLeave={handlePopupBlur}>
                    <FastForward1 width="38" height="38" color={theme.workerColor.line2} />
                  </li>
                </ul>
                <div className="video-right-option">
                  <div className="expend" onClick={handleContract} onMouseEnter={() => handlePopupFocus('contract')} onMouseLeave={handlePopupBlur}>
                    <Contract width="38" height="38" color={theme.workerColor.line2} />
                  </div>
                  <div className="repeat" onClick={handleRepeat} onMouseEnter={() => handlePopupFocus('repeat')} onMouseLeave={handlePopupBlur}>
                    <Repeat width="38" height="38" color={theme.workerColor.line2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="resize-handle resize-handle-top-left" onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')} />
        <div className="resize-handle resize-handle-top-right" onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')} />
        <div className="resize-handle resize-handle-bottom-left" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')} />
        <div className="resize-handle resize-handle-bottom-right" onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')} />
      </PopupVideoPlayer>
      <VideoPlayerWrapper>
        <div className="video-wrapper">
          {videoFile && (
            <video muted controls={false} height={302} ref={videoRef} src={videoFile.file_url} crossOrigin="anonymous" onContextMenu={handleContentMenuVideo} />
          )}
          {isSpeedControl && (
            <div className="video-speed-popup">
              <div className="speed-title">재생 속도 설정</div>
              <ul>
                {speedList.map((item) => (
                  <li key={`speed-${item.value}`} className={classNames({ active: item.value === speed })} onClick={() => handleSpeedControl(item)}>
                    {item.value === speed && <Check width="10" height="10" color={theme.workerColor.white} />}
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {toolTip.open && (
            <div className="tool-tip" style={{ right: toolTip.right }}>
              {toolTip.text}
            </div>
          )}
        </div>
        <div className="video-timeline">{formatTime(time)}</div>
        <div className="video-option-wrapper">
          <div className="video-option-left">
            <div className="speed-on" onClick={handleSpeed} onMouseEnter={() => handleFocus('speed')} onMouseLeave={handleBlur}>
              <SpeedOn width="24" height="24" color={theme.workerColor.line2} />
            </div>
          </div>
          <ul>
            <li onClick={() => handleMinusTime(1)} onMouseEnter={() => handleFocus('backForward1')} onMouseLeave={handleBlur}>
              <BackForward1 width="24" height="24" color={theme.workerColor.line2} />
            </li>
            <li onClick={() => handleMinusTime(0.1)} onMouseEnter={() => handleFocus('backForward01')} onMouseLeave={handleBlur}>
              <BackForward01 width="24" height="24" color={theme.workerColor.line2} />
            </li>
            <li>
              {isPlaying ? (
                <Pause
                  width="24"
                  height="24"
                  color={theme.workerColor.line2}
                  onClick={handlePause}
                  onMouseEnter={() => handleFocus('pause')}
                  onMouseLeave={handleBlur}
                />
              ) : (
                <Play
                  width="24"
                  height="24"
                  color={theme.workerColor.line2}
                  onClick={handlePlay}
                  onMouseEnter={() => handleFocus('play')}
                  onMouseLeave={handleBlur}
                />
              )}
            </li>
            <li onClick={() => handlePlusTime(0.1)} onMouseEnter={() => handleFocus('fastForward01')} onMouseLeave={handleBlur}>
              <FastForward01 width="24" height="24" color={theme.workerColor.line2} />
            </li>
            <li onClick={() => handlePlusTime(1)} onMouseEnter={() => handleFocus('fastForward1')} onMouseLeave={handleBlur}>
              <FastForward1 width="24" height="24" color={theme.workerColor.line2} />
            </li>
          </ul>
          <div className="video-right-option">
            <div className="expend" onClick={handleExpand} onMouseEnter={() => handleFocus('expend')} onMouseLeave={handleBlur}>
              <Expand width="24" height="24" color={theme.workerColor.line2} />
            </div>
            <div className="repeat" onClick={handleRepeat} onMouseEnter={() => handleFocus('repeat')} onMouseLeave={handleBlur}>
              <Repeat width="24" height="24" color={theme.workerColor.line2} />
            </div>
          </div>
        </div>
      </VideoPlayerWrapper>
    </>
  );
};

export default VideoPlayer;
