import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useViewerActions from 'actions/viewer-actions';
import AlertProvider from 'providers/alert.provider';
import { useRecoilState, useResetRecoilState } from 'recoil';
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
import { zoomAtom } from 'state/zoom.atom';
import { viewerJobFileListAtom } from 'state/viewer-job-file-list';
import { viewerJobListAtom } from 'state/viewer-job-list';
import { viewerLoadingSelector } from 'state/viewer-loading';
import { viewerLoadingAtom } from 'state/viewer-loading';
import { viewerLabelingAtom } from 'state/viewer-labeling';
import { viewerModalAtom } from 'state/viewer-modal';
import { viewerProjectAtom } from 'state/viewer-project';
import { styled } from 'styled-components';
import { IJobList } from 'types/worker-interface';
import { useElementSize } from 'usehooks-ts';

import ViewerAudioSection from 'components/Common/Viewer/AudioSection';
import ViewerFolderSection from 'components/Common/Viewer/FolderSection';
import ViewerHeader from 'components/Common/Viewer/Header';
import ViewerSpeakerSection from 'components/Common/Viewer/SpeakerSection';
import ViewerVideoSection from 'components/Common/Viewer/VideoSection';
import Loading from 'components/Common/Worker/Loading';

import DndProvider from '../../providers/dnd.provider';

const WorkerJobWrapper = styled.div<{ status: string }>`
  width: 1776px;
  padding-right: 15px;
  ${({ status }) => status === 'ready' && `pointer-events: none;`}
`;

const WorkerWrapper = styled.div`
  background-color: ${({ theme }) => theme.workerColor.black};
  .worker-background {
    background-color: ${({ theme }) => theme.workerColor.black};
    margin: 0 auto;
    display: flex;
    justify-content: center;
    color: #fff;
    width: 1920px;
    .worker-container {
      display: flex;
      flex-direction: column;
      width: 1920px;
      .worker-bottom {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-top: 20px;
        .worker-audio {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
`;

const ViewerWorker = () => {
  const [loading, setLoading] = useRecoilState(viewerLoadingSelector);
  const [ref] = useElementSize();
  const { workspaceId, id } = useParams<{ workspaceId: string; id: string }>();
  const { viewerProjectFind, viewerJobList, viewerJobFileList, viewerJobLabelingCategoryList, viewerLabeling } = useViewerActions();

  const resetViewerProject = useResetRecoilState(viewerProjectAtom);
  const resetViewerJobList = useResetRecoilState(viewerJobListAtom);
  const resetViewerJobFileList = useResetRecoilState(viewerJobFileListAtom);
  const resetViewerLabeling = useResetRecoilState(viewerLabelingAtom);
  const resetViewerLoading = useResetRecoilState(viewerLoadingAtom);
  const resetViewerModal = useResetRecoilState(viewerModalAtom);

  const resetZoom = useResetRecoilState(zoomAtom);
  const resetTime = useResetRecoilState(timeAtom);
  const resetIsPlaying = useResetRecoilState(isPlayAtom);
  const resetSpeed = useResetRecoilState(speedAtom);
  const resetDuration = useResetRecoilState(durationAtom);
  const resetScrollWidth = useResetRecoilState(scrollWidthAtom);
  const resetScrollLeft = useResetRecoilState(scrollLeftAtom);
  const resetSelectedSection = useResetRecoilState(selectedSectionAtom);
  const resetRepeat = useResetRecoilState(repeatAtom);
  const resetRepeatAgain = useResetRecoilState(repeatAgainAtom);
  const resetSeekingTime = useResetRecoilState(seekingTimeAtom);
  const resetCurrentSection = useResetRecoilState(currentSectionAtom);

  useEffect(() => {
    if (workspaceId && id) {
      fetchViewerProject();
    }
  }, []);

  useEffect(() => {
    return () => {
      resetViewerProject();
      resetViewerJobList();
      resetViewerJobFileList();
      resetViewerLabeling();
      resetViewerLoading();
      resetViewerModal();

      resetZoom();
      resetTime();
      resetIsPlaying();
      resetSpeed();
      resetDuration();
      resetScrollWidth();
      resetScrollLeft();
      resetSelectedSection();
      resetRepeat();
      resetRepeatAgain();
      resetSeekingTime();
      resetCurrentSection();
    };
  }, [
    resetCurrentSection,
    resetDuration,
    resetIsPlaying,
    resetRepeat,
    resetRepeatAgain,
    resetScrollLeft,
    resetScrollWidth,
    resetSeekingTime,
    resetSelectedSection,
    resetSpeed,
    resetTime,
    resetViewerJobFileList,
    resetViewerJobList,
    resetViewerLabeling,
    resetViewerLoading,
    resetViewerModal,
    resetViewerProject,
    resetZoom,
  ]);

  const fetchViewerProject = async () => {
    if (workspaceId && id) {
      await viewerProjectFind(workspaceId, id);
      await fetchViewerJobList();
    }
  };

  const fetchViewerJobList = async () => {
    if (workspaceId && id) {
      const job = await viewerJobList(workspaceId, id);
      fetchViewerJobFileList(job.job_id);
      fetchViewerJobLabelingCategoryList();
      fetchViewerLabeling(job.job_id);
    }
  };

  const fetchViewerJobFileList = async (jobId: string) => {
    if (id) {
      await viewerJobFileList(jobId);
    }
  };

  const fetchViewerJobLabelingCategoryList = async () => {
    if (id) {
      await viewerJobLabelingCategoryList(id, 'verbal');
      await viewerJobLabelingCategoryList(id, 'paraverbal');
      await viewerJobLabelingCategoryList(id, 'nonverbal');
    }
  };

  const fetchViewerLabeling = async (jobId: string) => {
    if (id) {
      await viewerLabeling(id, jobId);
    }
  };

  const handleJobSelect = async (job: IJobList) => {
    if (!job.job_id) {
      return;
    }
    setLoading(true);
    await fetchViewerJobFileList(job.job_id);
    await fetchViewerLabeling(job.job_id);
    setLoading(false);
  };

  return (
    <AlertProvider>
      <DndProvider>
        <WorkerWrapper>
          <div className="worker-background">
            <div className="worker-container">
              <ViewerHeader />
              <div className="worker-bottom">
                <ViewerFolderSection onSelectJob={handleJobSelect} />
                <WorkerJobWrapper status={''}>
                  <ViewerVideoSection />
                  <div ref={ref} className="worker-audio">
                    <ViewerAudioSection />
                    <ViewerSpeakerSection />
                  </div>
                </WorkerJobWrapper>
              </div>
            </div>
          </div>
          {loading && <Loading />}
        </WorkerWrapper>
      </DndProvider>
    </AlertProvider>
  );
};

export default ViewerWorker;
