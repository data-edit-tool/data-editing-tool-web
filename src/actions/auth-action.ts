import { AxiosResponse } from 'axios';
import crypto from 'crypto-js';
import { useSetRecoilState } from 'recoil';
import { authAtom, authInitLoadingSelector, IAuthState } from 'state/auth';
import { ILogin } from 'types/auth-interface';
import { IApi } from 'types/interface';
import axios, { setToken } from 'utils/axios';

function useUserActions() {
  const setAuth = useSetRecoilState(authAtom);
  const setAuthInitLoading = useSetRecoilState(authInitLoadingSelector);

  // 로그인
  async function login({ id, password }: { id: string; password: string }): Promise<{ code: string; message: string } | undefined> {
    const url = '/user/login';

    // 비밀번호 암호화
    const formData = {
      account: id,
      password: crypto.SHA512(password).toString(crypto.enc.Hex),
    };
    try {
      const {
        data: { result, data, code, message },
      }: AxiosResponse<IApi<ILogin>> = await axios.post(url, formData);
      if (result && code === 'F000') {
        const userData = {
          user: {
            id,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          },
          initLoading: false,
        };
        setAuth(userData);
        setToken(data.access_token);
        window.localStorage.setItem('user', JSON.stringify(userData));
      } else {
        return { code, message: message || '아이디 및 비밀번호를 확인해주세요' };
      }
    } catch (err) {
      throw err;
    }
  }

  // 비밀번호 초기화
  async function passwordReset({ account, password, changePassword }: { account: string; password: string; changePassword: string }) {
    const url = '/user/initPassword';

    const formData = {
      account,
      password: crypto.SHA512(password).toString(crypto.enc.Hex),
      change_password: crypto.SHA512(changePassword).toString(crypto.enc.Hex),
      change_password_ck: crypto.SHA512(changePassword).toString(crypto.enc.Hex),
    };
    try {
      const {
        data: { result, code, message },
      }: AxiosResponse<IApi<ILogin>> = await axios.put(url, formData);
      if (result && code === 'F000') {
        return;
      } else {
        throw { code, message };
      }
    } catch (err) {
      throw err;
    }
  }

  // 내 정보 호출
  async function me() {
    try {
      const localAuth = window.localStorage.getItem('user');
      if (localAuth) {
        const setLocalUser = JSON.parse(localAuth) as IAuthState;
        if (setLocalUser.user?.accessToken) {
          setToken(setLocalUser.user.accessToken);
        }
        const {
          data: { result, code, message },
        }: AxiosResponse<IApi> = await axios.get('/user/token/check');
        if (result && code === 'F000') {
          setAuth(setLocalUser);
        } else {
          throw { code, message };
        }
      }
      setAuthInitLoading(false);
    } catch (err) {
      window.localStorage.removeItem('user');
      setAuthInitLoading(false);
      throw err;
    }
  }

  // 내 정보 호출
  async function refreshToken() {
    try {
      const localAuth = window.localStorage.getItem('user');
      if (localAuth) {
        const setLocalUser = JSON.parse(localAuth) as IAuthState;
        if (setLocalUser.user?.accessToken) {
          setToken(setLocalUser.user.accessToken);
        }
        const {
          data: { result, code, message },
        }: AxiosResponse<IApi> = await axios.get('/user/token/check');
        if (result && code === 'F000') {
          setAuth(setLocalUser);
        } else {
          throw { code, message };
        }
      }
      setAuthInitLoading(false);
    } catch (err) {
      window.localStorage.removeItem('user');
      setAuthInitLoading(false);
      throw err;
    }
  }

  async function logout() {
    const url = '/user/logout';
    try {
      const {
        data: { result, code, message },
      }: AxiosResponse<IApi<ILogin>> = await axios.post(url);
      if (result && code === 'F000') {
        window.localStorage.removeItem('user');
        setToken('');
        return;
      } else {
        throw { code, message };
      }
    } catch (err) {
      window.localStorage.removeItem('user');
      setAuthInitLoading(false);
      setToken('');
      throw err;
    }
  }

  // async function refreshToken() {
  //   try {
  //     const localAuth = window.localStorage.getItem('user');
  //     if (localAuth) {
  //       const setLocalUser = JSON.parse(localAuth) as IAuthState;
  //       if (setLocalUser.user?.token) {
  //         setToken(setLocalUser.user.token);
  //       }
  //       const {
  //         data: { result, code, message },
  //       }: AxiosResponse<IApi> = await axios.get('/user/token/check');
  //       if (result && code === 'F000') {
  //         setAuth(setLocalUser);
  //       } else {
  //         throw { code, message };
  //       }
  //     }
  //   } catch (err) {
  //     window.localStorage.removeItem('user');
  //     throw err;
  //   }
  // }

  return { login, me, passwordReset, refreshToken, logout };
}

export { useUserActions };
