import React from 'react';
import { Navigate, useOutlet } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { PATH_USER_LIST } from 'utils/path';

const UserProtectedRoute: React.FC = () => {
  const [user, initLoading] = useAuth();
  const outlet = useOutlet();
  if (initLoading) {
    return null;
  }
  // 회원정보가없으면 로그인으로 이동
  if (!initLoading && !user) {
    return <Navigate to={PATH_USER_LIST.LOGIN} replace />;
  }

  return outlet;
};

export default UserProtectedRoute;
