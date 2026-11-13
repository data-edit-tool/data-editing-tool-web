import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { viewerProjectSelector } from 'state/viewer-project';
import { styled } from 'styled-components';
import { PATH_USER_LIST } from 'utils/path';

import Button from 'components/Common/Worker/Button';
import Back from 'components/SVG/Icon/Back';

const WorkerHeaderWrapper = styled.div`
  width: 100%;
  background-color: #151b27;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  position: relative;
  .back-btn {
    width: 152px;
    color: ${({ theme }) => theme.workerColor.txt2};
  }

  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.workerColor.white};
  }
  .btn-wrapper {
    display: flex;
    .job-step-btn,
    .job-reason-btn,
    .return-btn {
      width: 104px;
      color: ${({ theme }) => theme.workerColor.txt2};
    }
    .job-reason-btn {
      background-color: #a83349;
      color: ${({ theme }) => theme.workerColor.txt2};
      margin-right: 24px;
    }
    .return-btn {
      margin-right: 24px;
      font-weight: bold;
    }
  }
`;

const ViewerHeader = () => {
  const { workspaceId } = useParams();
  const projectName = useRecoilValue(viewerProjectSelector);
  const navigate = useNavigate();
  const onBack = () => {
    navigate(PATH_USER_LIST.WORKSPACE_MANAGEMENT_DETAIL.replace(':id', workspaceId as string));
  };
  return (
    <WorkerHeaderWrapper>
      <Button className="back-btn" variant="secondary" onClick={onBack}>
        <Back width="20" height="20" color="#bdbdbd" />
        목록으로 나가기
      </Button>
      <div className="title">{projectName}</div>
      <div />
    </WorkerHeaderWrapper>
  );
};

export default ViewerHeader;
