/* eslint-disable indent */
import { useRecoilState, useRecoilValue } from 'recoil';
import { workerJobFileSelectVideoIdSelector, workerJobFileVideoListSelector } from 'state/worker-job-file-list';
import { styled } from 'styled-components';
import { IOption } from 'types/interface';

import LabelingSection from '../LabelingSection';
import Select from '../Select';
import VideoPlayer from '../VideoPlayer';

const VideoSectionWrapper = styled.div`
  display: flex;
  height: 360px;
  width: 100%;
  .video-box {
    background-color: #141519;
    width: 812px;
    display: flex;
    margin-right: 16px;
    .video-select-box {
      width: 276px;
      padding: 20px 36px 20px 20px;
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
  }
  .video-table {
    width: 100%;
  }
`;

const VideoSection = () => {
  const videoList = useRecoilValue(workerJobFileVideoListSelector);
  const [selectVideo, setSelectVideo] = useRecoilState(workerJobFileSelectVideoIdSelector);

  // 비디오 선택 후 비디오 플레이어에 비디오 정보 전달
  const handleSelectVideo = (item: IOption) => {
    const findVideo = videoList.find((video) => video.file_url === item.value);
    if (findVideo) {
      setSelectVideo(findVideo);
    }
  };

  return (
    <VideoSectionWrapper>
      <div className="video-box">
        <div className="video-select-box">
          <div className="title">비디오 선택</div>
          <Select
            className="select-box"
            list={videoList.map((video) => ({
              value: video.file_url,
              name: video.file_name,
            }))}
            onClick={(item: IOption) => handleSelectVideo(item)}
            selectOption={
              selectVideo
                ? {
                    value: selectVideo.file_url,
                    name: selectVideo.file_name,
                  }
                : null
            }
          />
        </div>
        <VideoPlayer />
      </div>
      <LabelingSection />
    </VideoSectionWrapper>
  );
};

export default VideoSection;
