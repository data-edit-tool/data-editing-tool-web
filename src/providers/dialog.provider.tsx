import React from 'react';
import { atom, useRecoilState } from 'recoil';
import styled from 'styled-components';

const DialogContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.5); /* Overlay 투명도 조정 */
  z-index: 9999; /* Dialog 위에 위치하도록 z-index 설정 */
`;

const DialogBody = styled.div`
  background-color: #fff;
  width: 340px;

  border-radius: 6px;
  padding-bottom: 20px;
`;

const DialogTitle = styled.div`
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin: 0;
  padding: 10px;
  background-color: #3340a8;
`;

const DialogSubtitle = styled.div`
  padding: 18px 58px;
  color: #000;
  font-size: 13px;
  text-align: center;
`;

const DialogContent = styled.div`
  padding: 0 20px 18px;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 20px;
`;

const DialogButton = styled.button`
  background-color: #dddee0;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;

const DialogConfirmButton = styled.button`
  background-color: #3340a8;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;

type DialogOptions = {
  title: string;
  subTitle: React.ReactNode;
  content?: React.ReactNode;
  message?: string;
  okText?: string;
  cancelText?: string;
  isConfirm?: boolean;
};

type PromiseInfo = {
  resolve: (value: boolean | PromiseLike<boolean>) => void;
  reject: (reason?: any) => void;
};

const dialogState = atom<DialogOptions | undefined>({
  key: 'dialog',
  default: undefined,
});

const promiseInfoState = atom<PromiseInfo | undefined>({
  key: 'promiseInfo',
  default: undefined,
});

const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useRecoilState<DialogOptions | undefined>(dialogState);
  const [promiseInfo, setPromiseInfo] = useRecoilState<PromiseInfo | undefined>(promiseInfoState);

  const handleConfirm = () => {
    const resolve = promiseInfo?.resolve;
    setDialog(undefined);
    setPromiseInfo(undefined);
    resolve?.(true);
  };

  const handleCancel = () => {
    const resolve = promiseInfo?.resolve;
    setDialog(undefined);
    setPromiseInfo(undefined);
    resolve?.(false);
  };

  return (
    <>
      {dialog && (
        <DialogContainer>
          <DialogBody>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogSubtitle>{dialog.subTitle}</DialogSubtitle>
            {dialog.content && <DialogContent>{dialog.content}</DialogContent>}
            <DialogActions>
              {dialog.isConfirm ? (
                <DialogConfirmButton onClick={handleConfirm}>{dialog.okText ?? '확인'}</DialogConfirmButton>
              ) : (
                <>
                  <DialogButton onClick={handleCancel}>{dialog.cancelText ?? '취소'}</DialogButton>
                  <DialogConfirmButton onClick={handleConfirm}>{dialog.okText ?? '확인'}</DialogConfirmButton>
                </>
              )}
            </DialogActions>
          </DialogBody>
        </DialogContainer>
      )}
      {children}
    </>
  );
};

export default DialogProvider;
