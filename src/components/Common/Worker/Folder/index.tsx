import React from 'react';
import classNames from 'classnames';
import { styled } from 'styled-components';
import { IJobList } from 'types/worker-interface';

interface IFolder {
  className?: string;
  onClick: (job: IJobList) => void;
  active?: boolean;
  job: IJobList;
  children?: React.ReactNode;
}

const FolderWrapper = styled.li`
  width: 104px;
  padding: 24px 0px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.workerColor.boxBorder};
  background-color: ${({ theme }) => theme.workerColor.black};
  color: ${({ theme }) => theme.workerColor.white};
  font-size: ${({ theme }) => theme.fontSize.text_14};
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  &.active {
    background-color: ${({ theme }) => theme.workerColor.secondary};
    border: 1px solid ${({ theme }) => theme.workerColor.secondary};
  }
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Folder: React.FC<IFolder> = ({ className, onClick, children, active, job }) => {
  return (
    <FolderWrapper className={classNames(className, { active, disabled: !job.is_access })} onClick={() => onClick(job)}>
      {children}
    </FolderWrapper>
  );
};

export default Folder;
