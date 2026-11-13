/* eslint-disable indent */
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';
import styled from 'styled-components';
import { IUserWorkspaceManagementList } from 'types/user-workspace-management.interface';
import { IUserWorkspaceManagementAvailableList } from 'types/user-workspace-management-detail.interface';
import { PATH_USER_LIST } from 'utils/path';

const Container = styled.li`
  width: 385px;
  min-height: 264px;
  cursor: pointer;
  &.project {
    min-height: 234px;
  }
  a {
    padding: 30px;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 10px;
    box-shadow: 0 1px 0 0 ${({ theme }) => theme.adminColor.boxBorder};
    background-color: ${({ theme }) => theme.adminColor.white};
    .label {
      height: 26px;
      border-radius: 3px;
      padding: 6px 12px;
      background-color: #e3f7f2;
      font-size: ${({ theme }) => theme.fontSize.text_14};
      font-weight: 500;
      color: #3ec3a1;
      width: 97px;
      &.project {
        background-color: #fff3e7;
        color: #ffaa55;
        width: 101px;
      }
    }
    .title {
      width: 100%;
      color: #111;
      font-size: ${({ theme }) => theme.fontSize.text_20};
      font-weight: 700;
      margin-top: 20px;
      line-height: 21px;
    }
    .description {
      width: 100%;
      margin-top: 12px;
      font-size: ${({ theme }) => theme.fontSize.text_16};
      color: #5b636d;
      line-height: 21px;
    }
    ul {
      width: 100%;
      margin-top: auto;
      li {
        padding: 6px 8px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e9ecef;
        &:last-child {
          border-bottom: 0;
        }
        .left {
          color: #5b636d;
          font-size: ${({ theme }) => theme.fontSize.text_14};
        }
        .right {
          font-size: ${({ theme }) => theme.fontSize.text_14};
          color: #111;
          font-weight: 500;
        }
      }
    }
  }
`;

interface ICard {
  type?: string;
  workspace?: IUserWorkspaceManagementList;
  project?: IUserWorkspaceManagementAvailableList;
  isViewer: boolean;
}

const Card: React.FC<ICard> = ({ type, workspace, project, isViewer }) => {
  const { id } = useParams();

  return (
    <Container className={classNames({ project: type === 'project' })}>
      <Link
        to={
          type === 'project'
            ? isViewer
              ? PATH_USER_LIST.VIDEO_VIEWER.replace(':workspaceId', id as string).replace(':id', project!.project_id)
              : PATH_USER_LIST.VIDEO.replace(':workspaceId', id as string).replace(':id', project!.project_id)
            : PATH_USER_LIST.WORKSPACE_MANAGEMENT_DETAIL.replace(':id', workspace!.workspace_id)
        }
      >
        <span className={classNames('label', { project: type === 'project' })}>{type === 'project' ? '프로젝트 카드' : '워크스페이스'}</span>
        <div className="title">{type === 'project' ? project?.project_name : workspace?.workspace_name}</div>
        <div className="description">{type === 'project' ? project?.tool_type.name : workspace?.workspace_intro}</div>
        {type === 'project' ? (
          <ul>
            <li>
              <span className="left">생성일자</span>
              <span className="right">{project?.created}</span>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <span className="left">시작일</span>
              <span className="right">{workspace?.start_date}</span>
            </li>
            <li>
              <span className="left">종료일</span>
              <span className="right">{workspace?.end_date}</span>
            </li>
          </ul>
        )}
      </Link>
    </Container>
  );
};

export default Card;
