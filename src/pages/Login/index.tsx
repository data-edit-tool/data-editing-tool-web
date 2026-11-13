import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from 'actions/auth-action';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IAlert } from 'types/interface';
import { PATH_USER_LIST } from 'utils/path';

import Button from 'components/Common/Admin/Button';
import CheckBox from 'components/Common/Admin/CheckBox';
import Input from 'components/Common/Admin/Input';
import ModalContainer from 'components/Modal';
import Alert from 'components/Modal/Alert';
import PasswordResetModal from 'components/Modal/PasswordReset';
import Logo from 'components/SVG/Icon/Logo';
import VisibilityOn from 'components/SVG/Icon/VisabilityOn';
import VisibilityOff from 'components/SVG/Icon/VisibilityOff';

const Container = styled.section`
  max-width: 100%;
  display: flex;
  & > div {
    width: 50%;
    &.left {
      background-color: #f3f4f8;
      padding: 26px 20px 20px;
      .image-box {
        text-align: center;
        img {
          width: 674px;
          margin-top: 284px;
        }
      }
      .copy-right {
        margin-top: 304px;
        text-align: center;
        color: #949ca5;
        font-size: ${({ theme }) => theme.fontSize.text_14};
      }
    }
    &.right {
      display: flex;
      .login-box {
        width: 360px;
        margin: auto;
        h1 {
          font-weight: bold;
          font-size: 32px;
          color: #111;
          text-align: center;
        }
        .type {
          text-align: center;
          color: ${({ theme }) => theme.adminColor.primary};
          font-size: ${({ theme }) => theme.fontSize.text_16};
          font-weight: bold;
          padding: 16px 0px;
          border: 1px solid ${({ theme }) => theme.adminColor.primary};
          border-radius: 25px;
          width: 100%;
          margin-top: 40px;
        }
        form {
          margin-top: 40px;
          .password-input {
            margin-top: 16px;
          }
          .btn-wrapper {
            margin-top: 20px;
          }
          .check-box-input {
            margin-top: 24px;
          }
        }
      }
    }
  }
`;

interface IAdmin {
  isAdmin: boolean;
}

const AdminLogin: React.FC<IAdmin> = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { login } = useUserActions();
  const [isAlert, setIsAlert] = useState<IAlert>({
    open: false,
    title: '',
    content: '',
    type: '',
    alertType: 'alert',
  });
  const [isSave, setIsSave] = useState(false);
  const [isPasswordType, setIsPasswordType] = useState('password');

  const {
    register,
    getValues,
    formState: { errors },
    setValue,
    setFocus,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      id: '',
      password: '',
    },
  });

  useEffect(() => {
    // 아이디 저장된거 있으면 세팅
    const id = window.localStorage.getItem('id');
    if (id) {
      const { id: savedId } = JSON.parse(id);
      setIsSave(true);
      setValue('id', savedId);
    }
  }, []);

  const { id } = getValues();

  // 로그인
  const onSubmit = handleSubmit(async ({ id, password }) => {
    const res = await login({ id, password });
    // 비밀번호 초기화가 필요한 경우
    if (res?.code === 'U500') {
      setIsModalOpen(true);
      return;
    }
    if (res?.message) {
      alert(res.message);
      return;
    }
    // 아이디 저장일경우
    if (isSave) {
      const saveId = {
        id,
      };
      window.localStorage.setItem('id', JSON.stringify(saveId));
    } else {
      window.localStorage.removeItem('id');
    }
    navigate(PATH_USER_LIST.WORKSPACE_MANAGEMENT);
  });

  // 얼럿 close
  const onCancel = () => {
    const { type } = isAlert;
    if (type === 'passwordReset') {
      setTimeout(() => {
        setFocus('password');
      }, 0);
    }
    onAlertSetting(false, '', '', '', 'alert');
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

  // 변경된 비밀번호얼럿
  const onPasswordModalClose = () => {
    setIsModalOpen(false);
    setValue('password', '');
    onAlertSetting(true, '알림', '변경된 비밀번호로 로그인해주세요', 'passwordReset', 'alert');
  };

  const onAlertOpen = (message: string) => {
    onAlertSetting(true, '알림', message, '', 'alert');
  };

  const handleSaveId = () => {
    setIsSave((prev) => !prev);
  };

  // 비밀번호 아이콘 클릭
  const handlePasswordType = () => {
    if (isPasswordType === 'password') {
      setIsPasswordType('text');
    } else {
      setIsPasswordType('password');
    }
    setTimeout(() => {
      setFocus('password');
    }, 0);
  };

  return (
    <>
      {isModalOpen && (
        <ModalContainer id="modal">
          <PasswordResetModal account={id} onClose={onPasswordModalClose} onAlertOpen={onAlertOpen} />
        </ModalContainer>
      )}
      {isAlert.open && (
        <ModalContainer id="modal">
          <Alert title={isAlert.title} type={isAlert.alertType} content={isAlert.content} onConfirm={onCancel} onCancel={onCancel} />
        </ModalContainer>
      )}
      <Container>
        <div className="left">
          <div>
            <Logo width="200px" height="30px" color={theme.adminColor.primary} />
          </div>
          <div className="image-box">
            <img src="/images/admin-login-main.png" alt="어드민 로그인 메인" />
          </div>
          <div className="copy-right">© MAUM.AI. All rights reserved.</div>
        </div>
        <div className="right">
          <div className="login-box">
            <h1>로그인</h1>
            <div className="type">{isAdmin ? 'Admin' : 'User'}</div>
            <form onSubmit={onSubmit}>
              <Input
                register={register}
                options={{
                  required: '아이디를 입력해주세요.',
                }}
                type="text"
                name="id"
                className="id-input"
                placeholder="아이디"
                error={errors.id?.message}
              />
              <Input
                register={register}
                options={{
                  required: '비밀번호를 입력해주세요.',
                }}
                type={isPasswordType}
                name="password"
                className="password-input"
                placeholder="비밀번호"
                error={errors.password?.message}
                icon={
                  isPasswordType !== 'text' ? (
                    <VisibilityOff width="24" height="24" color={theme.adminColor.txt2} onClick={handlePasswordType} />
                  ) : (
                    <VisibilityOn width="24" height="24" color={theme.adminColor.txt2} onClick={handlePasswordType} />
                  )
                }
              />
              <Button type="submit" className="btn-wrapper">
                로그인
              </Button>
              <CheckBox name="idSave" checked={isSave} onClick={handleSaveId} className="check-box-input">
                아이디 저장
              </CheckBox>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AdminLogin;
