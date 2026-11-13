import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { viewerJobListSelector, viewerSelectJobIdSelector } from 'state/viewer-job-list';
import { styled } from 'styled-components';
import { IJobList } from 'types/worker-interface';

import Folder from 'components/Common/Worker/Folder';

const ViewerFolderSectionWrapper = styled.div`
  padding: 0px 20px 0px 16px;
  position: relative;
  height: 700px;
  .up-arrow {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -47px;
    left: 46%;
    transform: translate(-50%, 0);
    background-color: ${({ theme }) => theme.workerColor.secondary};
    svg {
      transform: rotate(180deg);
    }
  }
  .down-arrow {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -47px;
    left: 46%;
    transform: translate(-50%, 0);
    background-color: ${({ theme }) => theme.workerColor.secondary};
  }
  ul {
    height: 685px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      background-color: #373d48;
      width: 12px;
      height: 12px;
    }

    &::-webkit-scrollbar-track {
      background-color: #373d48;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.workerColor.line2};
      border-radius: 16px;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }
    li {
      margin-bottom: 16px;
      margin-right: 4px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

interface ViewerFolderSectionProps {
  onSelectJob?: (job: IJobList) => void;
}

const ViewerFolderSection: React.FC<ViewerFolderSectionProps> = ({ onSelectJob }) => {
  const viewerJobList = useRecoilValue(viewerJobListSelector);
  const [selectJob, setSelectJob] = useRecoilState(viewerSelectJobIdSelector);

  const handleFolderMove = (job: IJobList) => {
    if (!job.is_access) {
      return;
    }
    if (selectJob?.job_id === job.job_id) {
      return;
    }
    setSelectJob(job);
    onSelectJob?.(job);
  };

  return (
    <ViewerFolderSectionWrapper>
      <ul>
        {viewerJobList.map((folder) => (
          <Folder active={folder.job_id === selectJob?.job_id} key={folder.job_id} onClick={handleFolderMove} job={folder}>
            {folder.job_name}
          </Folder>
        ))}
      </ul>
    </ViewerFolderSectionWrapper>
  );
};

export default ViewerFolderSection;
