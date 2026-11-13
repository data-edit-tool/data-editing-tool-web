// 주소 리스트
export const PATH_USER_LIST = Object.freeze({
  MAIN: '/',
  LOGIN: '/user/login',
  WORKSPACE_MANAGEMENT: '/user/workspace/management',
  WORKSPACE_MANAGEMENT_DETAIL: '/user/workspace/management/:id',
  VIDEO: '/video/:workspaceId/:id',
  VIDEO_VIEWER: '/video/viewer/:workspaceId/:id',
});
