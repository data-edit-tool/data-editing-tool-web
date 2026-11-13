import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserActions } from 'actions/auth-action';
import { useUserWorkspaceManagementActions } from 'actions/user-workspace-management-action';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authAtom } from 'state/auth';
import { userWorkspaceManagementListSelector } from 'state/user-workspace-management';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { PATH_USER_LIST } from 'utils/path';

import ModalContainer from 'components/Modal';
import Alert from 'components/Modal/Alert';
import Home from 'components/SVG/Icon/Home';
import Logo from 'components/SVG/Icon/Logo';
import Logout from 'components/SVG/Icon/Logout';

const Container = styled.nav`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 240px;
  z-index: 4;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.adminColor.secondary};
  .content {
    width: 240px;
    height: 100%;
    padding: 26px 20px 60px;
    display: flex;
    flex-direction: column;
    .auth-id {
      margin-top: 40px;
      border: 1px solid #3b475d;
      border-radius: 10px;
      text-align: center;
      width: 100%;
      background-color: ${({ theme }) => theme.workerColor.hover};
      padding: 10px 0px;
      font-size: ${({ theme }) => theme.fontSize.text_18};
      color: ${({ theme }) => theme.workerColor.txt2};
      font-weight: bold;
      line-height: 20px;
    }
    ul.user-menu {
      margin-top: 20px;
      border-radius: 10px;
      background-color: #263f74;
      height: calc(100% - 206px);
      li {
        &.sidebar-list {
          height: calc(100% - 52px);
          overflow-y: auto;
          &::-webkit-scrollbar {
            background-color: #373d48;
            width: 10px;
            height: 16px;
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
        }
        &.home {
          border-bottom: 1px solid #17284d;
          &.active {
            a {
              svg {
                path {
                  stroke: ${({ theme }) => theme.adminColor.white};
                }
              }
              span {
                color: ${({ theme }) => theme.adminColor.white};
              }
            }
          }
          a {
            svg {
              margin-right: 14px;
            }
            span {
              font-size: ${({ theme }) => theme.fontSize.text_16};
              font-weight: 700;
              color: ${({ theme }) => theme.workerColor.txt2};
            }
          }
        }
        a {
          padding: 17px 20px;
          display: flex;
          align-items: center;
          span {
            font-size: ${({ theme }) => theme.fontSize.text_14};
            color: ${({ theme }) => theme.workerColor.txt2};
          }
        }
        &.active {
          span {
            font-weight: 700;
            color: ${({ theme }) => theme.adminColor.white};
          }
        }
      }
    }
    .logout {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 20px;
      margin-top: auto;
      cursor: pointer;
      svg {
        margin-right: 14px;
      }
      span {
        font-size: ${({ theme }) => theme.fontSize.text_16};
        font-weight: 500;
        color: ${({ theme }) => theme.workerColor.txt2};
      }
    }
  }
`;

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useUserActions();
  const [auth] = useRecoilState(authAtom);
  const sidebarList = useRecoilValue(userWorkspaceManagementListSelector);
  const { list } = useUserWorkspaceManagementActions();
  const navigate = useNavigate();
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    // 워크스페이스 리스트 조회
    async function fetch() {
      try {
        await list();
      } catch (err) {
        console.log(err);
      }
    }
    fetch();
  }, [pathname]);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    navigate(PATH_USER_LIST.LOGIN);
  };

  const onCancel = () => {
    setIsAlert(false);
  };

  return (
    <Container>
      {isAlert && (
        <ModalContainer id="modal">
          <Alert
            title="알림"
            type="alert"
            content="업로드가 진행 중입니다.<br/>업로드가 완료 후 로그아웃 가능 합니다."
            onCancel={onCancel}
            onConfirm={onCancel}
          />
        </ModalContainer>
      )}
      <div className="content">
        <Link to={PATH_USER_LIST.MAIN}>
          <Logo width="200" height="30" color={theme.adminColor.white} />
        </Link>
        <div className="auth-id">{auth.user?.id}</div>
        <ul className="user-menu">
          <li className="home">
            <Link to={PATH_USER_LIST.WORKSPACE_MANAGEMENT}>
              <Home width="16" height="16" color={theme.workerColor.txt2} />
              <span>Home</span>
            </Link>
          </li>
          {!!sidebarList.length && (
            <li className="sidebar-list">
              <ul>
                {sidebarList.map((item) => (
                  <li className={classNames({ active: pathname.includes(item.workspace_id) })} key={`sidebar-${item.workspace_id}`}>
                    <Link to={PATH_USER_LIST.WORKSPACE_MANAGEMENT_DETAIL.replace(':id', item.workspace_id)}>
                      <span>{item.workspace_name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
        <div className="logout" onClick={handleLogout}>
          <Logout width="16" height="16" color="#acaebe" />
          <span>로그아웃</span>
        </div>
      </div>
    </Container>
  );
};

export default Sidebar;
