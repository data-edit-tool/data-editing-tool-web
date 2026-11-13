import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import durationAtom from 'state/duration.atom';
import { isPlayAtom } from 'state/isPlay.atom';
import { seekingTimeAtom } from 'state/seeking-time.atom';
import { speedAtom } from 'state/speed.atom';
import { timeAtom } from 'state/time.atom';

const useVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const popupVideoRef = useRef<HTMLVideoElement | null>(null);
  const totalTime = useRecoilValue(durationAtom);

  const [duration, _] = useState<number>(0);

  // setTime에 debounce를 건다.
  const currentTime = useRecoilValue(timeAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayAtom);
  const [speed, setSpeed] = useRecoilState(speedAtom);
  const setSeekingTime = useSetRecoilState(seekingTimeAtom);

  // 재생 여부가 바뀌면 영상을 재생하거나 멈춥니다.
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          if (isPlaying) {
            // play 메서드가 성공적으로 호출될 때까지 기다림
            await videoRef.current.play();
          } else {
            videoRef.current.pause(); // pause는 굳이 await할 필요가 없습니다.
          }
        } catch (error) {
          console.error('Error occurred while playing/pausing video:', error);
        }
      }
    };
    const playPopupVideo = async () => {
      if (popupVideoRef.current) {
        try {
          if (isPlaying) {
            // play 메서드가 성공적으로 호출될 때까지 기다림
            await popupVideoRef.current.play();
          } else {
            popupVideoRef.current.pause(); // pause는 굳이 await할 필요가 없습니다.
          }
        } catch (error) {
          console.error('Error occurred while playing/pausing video:', error);
        }
      }
    };
    playVideo();
    playPopupVideo();
  }, [isPlaying]);

  // 스피드가 바뀌면 영상의 재생속도를 변경합니다.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    if (popupVideoRef.current) {
      popupVideoRef.current.playbackRate = speed;
    }
  }, [speed]);

  // 재생
  const handlePlay = () => {
    setIsPlaying(true);
  };

  // 일시정지
  const handlePause = () => {
    setIsPlaying(false);
  };

  // 시간이동
  const plusTime = (time: number) => {
    setSeekingTime(currentTime / 1000 + time > totalTime ? totalTime : currentTime / 1000 + time);
  };

  // 시간이동
  const minusTime = (time: number) => {
    setSeekingTime(currentTime / 1000 - time < 0 ? 0 : currentTime / 1000 - time);
  };

  // 재생속도 조절
  const handleSpeedChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = value;
      setSpeed(value);
    }
    if (popupVideoRef.current) {
      popupVideoRef.current.playbackRate = value;
      setSpeed(value);
    }
  };

  return {
    videoRef,
    popupVideoRef,
    duration,
    time: currentTime,
    isPlaying,
    speed,
    handlePlay,
    handlePause,
    handleSpeedChange,
    plusTime,
    minusTime,
  };
};

export default useVideoPlayer;
