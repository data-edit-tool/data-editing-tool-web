import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserWorkspaceManagementDetailActions } from 'actions/user-workspace-management-detail-action';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import {
  userWorkspaceManagementAvailableListSelector,
  userWorkspaceManagementIsViewerSelector,
  userWorkspaceManagementNameSelector,
  userWorkspaceManagementProgressListSelector,
} from 'state/user-workspace-managment-detail';
import styled from 'styled-components';
import { IAlert } from 'types/interface';
import { isCustomError } from 'utils/error';

import Button from 'components/Common/Admin/Button';
import Title from 'components/Common/Admin/Title';
import Card from 'components/Common/User/Card';
import Layout from 'components/Layout';
import Header from 'components/Layout/Header';
import ModalContainer from 'components/Modal';
import Alert from 'components/Modal/Alert';

const Container = styled.section`
  padding: 34px 40px 40px;
  .title-box {
    button {
      width: 192px;
    }
  }
  .sub-title {
    margin-top: 30px;
    font-size: ${({ theme }) => theme.fontSize.text_20};
    font-weight: 500;
    color: #111;
    &.mt-48 {
      margin-top: 48px;
    }
  }
  & > ul {
    margin-top: 20px;
    display: flex;
    overflow-x: auto;
    flex-wrap: nowrap;
    &::-webkit-scrollbar {
      background-color: #f4f6f8;
      width: 12px;
      height: 12px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f4f6f8;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.adminColor.boxBorder};
      border-radius: 16px;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    & > li {
      width: 385px;
      flex: 0 0 auto;
      margin-right: 20px;
      margin-bottom: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const UserManagementWorkspaceDetail = () => {
  const { id } = useParams();
  const { list, guideDownload } = useUserWorkspaceManagementDetailActions();
  const workspaceName = useRecoilValue(userWorkspaceManagementNameSelector);
  const isViewer = useRecoilValue(userWorkspaceManagementIsViewerSelector);
  const availableList = useRecoilValue(userWorkspaceManagementAvailableListSelector);
  const progressList = useRecoilValue(userWorkspaceManagementProgressListSelector);
  const [isDownloadList, setIsDownloadList] = useState<string[]>([]);
  const [isAlert, setIsAlert] = useState<IAlert>({
    open: false,
    title: '',
    content: '',
    type: '',
    alertType: 'alert',
  });

  useEffect(() => {
    async function fetch() {
      await list(id as string);
    }
    async function fetchGuideList() {
      const guideList = await guideDownload(id as string);
      setIsDownloadList(guideList && guideList.length ? guideList.map((guide) => guide.guide_file_url) : []);
    }
    // 프로젝트 리스트 및 가이드 파일 리스트 가져오기
    fetch();
    fetchGuideList();
  }, [id]);

  const onCancel = () => {
    onAlertSetting(false, '', '', '', 'alert');
  };

  // 가이드 파일 다운로드
  const handleGuideDownload = async () => {
    try {
      isDownloadList.forEach((downloadUrl) => {
        fetch(downloadUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const fileName = downloadUrl.match(/\/([^/]+\.[^/]+)$/);
            const fileNameWithExtension = fileName?.length ? fileName[1] : 'file.pdf';
            a.href = url;
            a.download = fileNameWithExtension;
            a.click();
          })
          .catch((err) => {
            onAlertSetting(true, '알림', `${isCustomError(err) && err?.message ? err.message : '다운로드를 실패하였습니다'}`, '', 'alert');
            throw err;
          });
      });
    } catch (err) {
      onAlertSetting(true, '알림', `${isCustomError(err) && err?.message ? err.message : '다운로드를 실패하였습니다'}`, '', 'alert');
    }
  };

  const onAlertSetting = (open: boolean, title: string, content: string, type: string, alertType: 'alert' | 'confirm') => {
    setIsAlert({
      open,
      title,
      content,
      type,
      alertType,
    });
  };

  return (
    <Layout type="user">
      {isAlert.open && (
        <ModalContainer id="modal">
          <Alert title={isAlert.title} type={isAlert.alertType} content={isAlert.content} onConfirm={onCancel} onCancel={onCancel} />
        </ModalContainer>
      )}
      <Header>
        <b>Home</b>
      </Header>
      <Container>
        <Title
          className="title-box"
          title={workspaceName}
          button={
            isDownloadList.length ? (
              <Button variant="secondary" onClick={handleGuideDownload}>
                작업 가이드 다운로드
              </Button>
            ) : null
          }
        />
        {!!progressList.length && (
          <>
            <div className="sub-title">Task in Progress</div>
            <ul>
              {progressList.map((item) => {
                return <Card key={item.project_id} type="project" project={item} isViewer={isViewer} />;
              })}
            </ul>
          </>
        )}
        {/* <div className="sub-title">Task in Progress</div>
        <ul>
          {abc.map((item, index) => {
            return <Card key={item} type="project" />;
          })}
        </ul> */}
        {!!availableList.length && (
          <>
            <div className={classNames('sub-title', { 'mt-48': !!progressList.length })}>Available Tasks</div>
            <ul>
              {availableList.map((item) => {
                return <Card key={item.project_id} type="project" project={item} isViewer={isViewer} />;
              })}
            </ul>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default UserManagementWorkspaceDetail;
