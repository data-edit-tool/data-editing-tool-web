import React from 'react';
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
      padding: 20px 0px;
      .content {
        text-align: center;
        img {
          width: 200px;
          height: 200px;
        }
      }
      .btn-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 20px;
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

interface IWorkerProfile {
  title: string;
  imageUrl: string;
  onConfirm: () => void;
}

const WorkerProfile: React.FC<IWorkerProfile> = ({ title, imageUrl, onConfirm }) => {
  return (
    <Container>
      <div className="overlay" onClick={onConfirm} />
      <div className="modal-main">
        <div className="header">
          {title}
          <Close width="10" height="10" color={theme.workerColor.line2} onClick={onConfirm} />
        </div>
        <div className="body">
          <div className="content">
            <img src={imageUrl} alt={`${title} 사진`} />
          </div>
          <div className="btn-wrapper">
            <Button className="submit-btn" variant="primary" onClick={onConfirm}>
              확인
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WorkerProfile;
