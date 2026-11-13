/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';
import { theme } from 'styles/theme';

import Button from 'components/Common/Worker/Button';
import Close from 'components/SVG/Icon/Close';

const Container = styled.div<{ iscancel: string; color: string }>`
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
      background-color: ${({ color }) => color};
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
      }
      .btn-wrapper {
        display: flex;
        ${({ iscancel }) => (iscancel ? 'justify-content: space-between;' : 'justify-content: center;')}

        margin-top: 20px;
        .close-btn {
          width: 120px;
          margin-right: 20px;
          background-color: #dddee0;
          color: #565e6a;
        }
        .submit-btn {
          width: 120px;
          background-color: ${({ color }) => color};
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

interface IAlert {
  title: string;
  content: string;
  onCancel?: () => void;
  onConfirm: () => void;
  isCancel?: boolean;
  leftBtnText?: string;
  rightBtnText: string;
  confirmDisabled?: boolean;
  color?: string;
}

const Alert: React.FC<IAlert> = ({
  title,
  content,
  onCancel,
  onConfirm,
  isCancel,
  leftBtnText = '취소',
  rightBtnText,
  confirmDisabled = false,
  color = theme.workerColor.primary,
}) => {
  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
  };

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      // esc and enter
      if (isCancel) {
        if (e.keyCode === 27 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          setTimeout(() => {
            handleClose();
          }, 0);
        } else if (e.keyCode === 13 && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !confirmDisabled) {
          setTimeout(() => {
            onConfirm();
          }, 0);
        }
      } else {
        if ((e.keyCode === 27 || e.keyCode === 13) && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
          setTimeout(() => {
            handleClose();
          }, 0);
        }
      }
    };
    document.addEventListener('keydown', handleShortcut);

    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, [handleClose, onCancel, isCancel, onConfirm, confirmDisabled]);

  return (
    <Container iscancel={isCancel ? 'cancel' : ''} color={color}>
      <div className="overlay" onClick={onCancel} />
      <div className="modal-main">
        <div className="header">
          {title}
          <Close width="10" height="10" color={theme.workerColor.line2} onClick={onCancel} />
        </div>
        <div className="body">
          <div className="content">{parse(content)}</div>
          <div className="btn-wrapper">
            {isCancel && (
              <Button className="close-btn" variant="secondary" onClick={onCancel}>
                {leftBtnText}
              </Button>
            )}
            <Button className="submit-btn" variant="primary" onClick={onConfirm} disabled={confirmDisabled}>
              {rightBtnText}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Alert;
