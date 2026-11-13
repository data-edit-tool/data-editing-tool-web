import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from 'pages/Login';
import UserManagementWorkspaceDetail from 'pages/User/Management/Detail';
import UserManagementWorkspace from 'pages/User/Management/Workspace';
import ViewerWorker from 'pages/ViewerWorker';
import Worker from 'pages/Worker';
import { PATH_USER_LIST } from 'utils/path';

import ProtectedRoute from './ProtectedRoute';
import RedirectRoute from './RedirectRoute';

const PageRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<RedirectRoute />} />
    <Route path={PATH_USER_LIST.LOGIN} element={<Login isAdmin={false} />} />
    <Route element={<ProtectedRoute />}>
      <Route path={PATH_USER_LIST.WORKSPACE_MANAGEMENT} element={<UserManagementWorkspace />} />
      <Route path={PATH_USER_LIST.WORKSPACE_MANAGEMENT_DETAIL} element={<UserManagementWorkspaceDetail />} />
      <Route path={PATH_USER_LIST.VIDEO} element={<Worker />} />
      <Route path={PATH_USER_LIST.VIDEO_VIEWER} element={<ViewerWorker />} />
    </Route>
  </Routes>
);

export default PageRoutes;
