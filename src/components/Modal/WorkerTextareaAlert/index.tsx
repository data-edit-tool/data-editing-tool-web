import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import styled from 'styled-components';
import { theme } from 'styles/theme';

import Button from 'components/Common/Worker/Button';
import Close from 'components/SVG/Icon/Close';

const Container = styled.div`
  .modal-main {
    z-index: 7002;
    position: fixed;
    width: 100%;
    max-width: 340px;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.workerColor.white};
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    box-shadow: 0 2px 8px 0 rgba(18, 44, 72, 0.15);
    .header {
      background-color: ${({ theme }) => theme.workerColor.primary};
      position: relative;
      color: ${({ theme }) => theme.workerColor.white};
      text-align: center;
      font-weight: 500;
      font-size: ${({ theme }) => theme.fontSize.text_16};
      padding: 11px 0px;
      svg {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
    }
    .body {
      padding: 20px 40px;
      .content {
        text-align: center;
        font-size: 13px;
        line-height: 20px;
        span {
          color: ${({ theme }) => theme.workerColor.primary};
        }
      }
      textarea {
        width: 100%;
        height: 68px;
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #abaeb9;
        background-color: #edeff4;
        resize: none;
        color: ${({ theme }) => theme.workerColor.black};
        font-size: 12px;
        border-radius: 4px;
        line-height: 18px;
      }
      .btn-wrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        .close-btn {
          width: 120px;
          margin-right: 20px;
          background-color: #dddee0;
          color: #565e6a;
        }
        .submit-btn {
          width: 120px;
        }
      }
    }
  }
  .overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: ${({ theme }) => theme.adminColor.black};
    opacity: 0.7;
    z-index: 7001;
  }
`;

interface IWorkerTextareaAlert {
  onCancel: () => void;
  onConfirm: (content: string) => void;
  title: string;
  content: string;
  placeHolder: string;
  buttonText: string;
}

const WorkerTextareaAlert: React.FC<IWorkerTextareaAlert> = ({ onConfirm, onCancel, title, content, placeHolder, buttonText }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.keyCode === 27 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        setTimeout(() => {
          onCancel();
        }, 0);
      }
    };
    document.addEventListener('keydown', handleShortcut);

    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, [onCancel]);

  const onSubmit = handleSubmit(({ content }) => {
    onConfirm(content);
  });

  return (
    <Container>
      <div className="overlay" onClick={onCancel} />
      <div className="modal-main">
        <div className="header">
          {title}
          <Close width="10" height="10" color={theme.workerColor.line2} onClick={onCancel} />
        </div>
        <div className="body">
          <div className="content">{parse(content)}</div>
          <textarea {...register('content')} placeholder={parse(placeHolder) as string} />
          <div className="btn-wrapper">
            <Button className="close-btn" variant="secondary" onClick={onCancel}>
              취소
            </Button>
            <Button className="submit-btn" variant="primary" onClick={onSubmit}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WorkerTextareaAlert;
