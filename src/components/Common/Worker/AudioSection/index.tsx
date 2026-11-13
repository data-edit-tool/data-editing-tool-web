/* eslint-disable indent */
import { useEffect } from 'react';
import useVideoPlayer from 'hooks/useVideoPlayer';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { workerJobFileAudioListSelector, workerJobFileSelectAudioIdSelector } from 'state/worker-job-file-list';
import { workerLabelingMetaSelector } from 'state/worker-labeling';
import { workerLoadingSelector } from 'state/worker-loading';
import styled from 'styled-components';
import { IOption } from 'types/interface';
import { getSaveWorker } from 'utils/worker-storage';

import Select from '../Select';
import WaveShaperPlayer from '../WaveShaperPlayer';

const AudioSectionWrapper = styled.div`
  margin-top: 16px;
  width: 100%;
  display: flex;
  height: 138px;
  background-color: #141519;
  .audio-box {
    width: 276px;
    padding: 20px 36px 38px 20px;
    .title {
      font-size: ${({ theme }) => theme.fontSize.text_14};
      color: ${({ theme }) => theme.workerColor.white};
    }
    .select-box {
      margin-top: 8px;
      ul {
        overflow-y: auto;
        max-height: 257px;
      }
    }
  }
`;

const AudioSection = () => {
  const audioList = useRecoilValue(workerJobFileAudioListSelector);
  const [selectAudio, setSelectAudio] = useRecoilState(workerJobFileSelectAudioIdSelector);
  const setLoading = useSetRecoilState(workerLoadingSelector);
  const { handlePause } = useVideoPlayer();
  const projectMeta = useRecoilValue(workerLabelingMetaSelector);

  useEffect(() => {
    if (projectMeta) {
      const saveWorker = getSaveWorker();
      if (saveWorker) {
        const saveAudio = saveWorker.audio;
        if (
          saveWorker.workId === projectMeta.work_id &&
          saveWorker.jobId === projectMeta.job_id &&
          saveWorker.workerId === projectMeta.worker_id &&
          saveWorker.audio
        ) {
          const findAudio = audioList.find((audio) => audio.file_url === saveAudio.file_url);
          if (findAudio) {
            // setSelectAudio(findAudio);
          }
        }
      }
    }
  }, [projectMeta]);

  // 오디오 선택
  const handleSelectAudio = (item: IOption) => {
    const findAudio = audioList.find((audio) => audio.file_url === item.value);
    // 오디오 선택 후 일시정지 및 웨이브서퍼 로딩 처리
    if (findAudio && findAudio.file_url !== selectAudio?.file_url) {
      handlePause();
      setTimeout(() => {
        setLoading(true);
        setSelectAudio(findAudio);
      }, 300);
    }
  };

  return (
    <AudioSectionWrapper>
      <div className="audio-box">
        <div className="title">오디오 선택</div>
        <Select
          className="select-box"
          list={audioList.map((audio) => ({
            value: audio.file_url,
            name: audio.file_name,
          }))}
          onClick={(item: IOption) => handleSelectAudio(item)}
          selectOption={
            selectAudio
              ? {
                  value: selectAudio.file_url,
                  name: selectAudio.file_name,
                }
              : null
          }
        />
      </div>
      <WaveShaperPlayer />
    </AudioSectionWrapper>
  );
};

export default AudioSection;
