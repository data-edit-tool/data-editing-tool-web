/* eslint-disable indent */
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { PATH_USER_LIST } from 'utils/path';

const RedirectRoute: React.FC = () => {
  const [user, initLoading] = useAuth();
  if (initLoading) {
    return null;
  }

  // 회원정보가 있으면 워크스페이스 리스트로 이동 아니면 로그인으로 이동
  return <Navigate to={user ? PATH_USER_LIST.WORKSPACE_MANAGEMENT : PATH_USER_LIST.LOGIN} replace />;
};

export default RedirectRoute;
