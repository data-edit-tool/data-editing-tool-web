/**
 * 회원 관련
 */
export interface ILogin {
  access_token: string;
  refresh_token: string;
}

export interface IUser {
  id: string;
  accessToken: string;
  refreshToken: string;
}
