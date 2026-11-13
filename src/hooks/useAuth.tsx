import { useEffect } from 'react';
import { useUserActions } from 'actions/auth-action';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authInitLoadingSelector, authUserSelector } from 'state/auth';
import { setToken } from 'utils/axios';

const useAuth = () => {
  const { me } = useUserActions();
  const [initLoading, setInitLoading] = useRecoilState(authInitLoadingSelector);
  const user = useRecoilValue(authUserSelector);
  useEffect(() => {
    // 유저 로그인 정보 받아오기
    const fetchMe = async () => {
      try {
        await me();
      } catch (err) {
        setToken('');
        setInitLoading(false);
      }
    };
    fetchMe();
  }, []);

  return [user, initLoading];
};

export default useAuth;
