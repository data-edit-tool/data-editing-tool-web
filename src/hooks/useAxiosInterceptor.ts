// hooks/useAxiosInterceptor.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import axiosRefresh from 'axios';
import { useSetRecoilState } from 'recoil';
import { authAtom, IAuthState } from 'state/auth';
import { ILogin } from 'types/auth-interface';
import { IApi } from 'types/interface';
import axios, { setToken } from 'utils/axios';
import { PATH_USER_LIST } from 'utils/path';

// 토큰을 갱신하기 위한 플래그
let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/ban-types
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

// 토큰이 만료되었을 때 대기 중인 요청 처리 함수
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

export const useAxiosInterceptor = () => {
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();
  const responseInterceptor = axios.interceptors.response.use(
    async (response) => {
      const originalRequest = response.config;
      const { code } = response.data; // 응답 데이터 안의 code 값 확인
      // 응답 코드가 112일 경우 토큰 갱신
      if (code === 'F010' && !(originalRequest as any)._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axios(originalRequest); // 갱신된 토큰으로 원래 요청 재시도
            })
            .catch((err) => {
              console.log(err);
              return Promise.reject(err);
            });
        }

        (originalRequest as any)._retry = true;
        isRefreshing = true;

        try {
          const localAuth = window.localStorage.getItem('user') as any;
          const setLocalUser = JSON.parse(localAuth) as IAuthState;
          const {
            data: { result, code, data },
          }: AxiosResponse<IApi<ILogin>> = await axiosRefresh.post(
            '/user/token/reissue',
            {
              refresh_token: setLocalUser.user?.refreshToken,
            },
            {
              baseURL: import.meta.env.VITE_API_HOST,
              headers: {
                Authorization: `Bearer ${setLocalUser.user?.accessToken}`,
              },
            },
          ); // 토큰 갱신

          if (result && code === 'F000') {
            const userData = {
              user: {
                id: setLocalUser.user!.id,
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
              },
              initLoading: false,
            };
            setAuth(userData);
            setToken(data.access_token);
            window.localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common.Authorization = `Bearer ${userData.user?.accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${userData.user?.accessToken}`; // 원래 요청에 새로운 토큰 설정
            processQueue(null, userData.user?.accessToken); // 대기 중인 요청 처리
            return axios(originalRequest); // 원래 요청을 갱신된 토큰으로 재시도
          } else {
            navigate(PATH_USER_LIST.LOGIN);
            return Promise.reject(data);
          }
        } catch (err) {
          processQueue(err, null); // 실패 시 대기 중인 요청 처리
          return Promise.reject(err); // 에러 처리
        } finally {
          isRefreshing = false; // 갱신 완료 후 상태 초기화
        }
      }

      return response; // 응답 데이터 그대로 반환
    },
    (error) => {
      return Promise.reject(error); // 네트워크나 서버 관련 에러는 그대로 처리
    },
  );

  useEffect(() => {
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [responseInterceptor]);
};
