import React from 'react';
import { useRecoilValue } from 'recoil';
import { workerImpossibleListSelector } from 'state/worker-impossible-list';
import styled from 'styled-components';
import { theme } from 'styles/theme';

import Button from 'components/Common/Worker/Button';
import Close from 'components/SVG/Icon/Close';

const Container = styled.div`
  .modal-main {
    z-index: 7002;
    position: fixed;
    width: 100%;
    max-width: 1200px;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.workerColor.white};
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    box-shadow: 0 2px 8px 0 rgba(18, 44, 72, 0.15);
    & > .header {
      background-color: ${({ theme }) => theme.workerColor.primary};
      position: relative;
      color: ${({ theme }) => theme.workerColor.white};
      text-align: center;
      font-weight: 500;
      font-size: ${({ theme }) => theme.fontSize.text_16};
      padding: 15px 0px;
      svg {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
    }
    .body {
      padding: 40px 40px 20px;
      ul {
        height: 350px;
        overflow-y: auto;
        border-top: 1px solid ${({ theme }) => theme.adminColor.line2};
        border-bottom: 1px solid ${({ theme }) => theme.adminColor.line2};
        li {
          height: 60px;
          display: flex;
          border-bottom: 1px solid ${({ theme }) => theme.adminColor.line2};
          &:last-child {
            border-bottom: none;
          }
          &.header {
            & > div {
              background-color: #f4f6f8;
              color: #888888;
              font-size: ${({ theme }) => theme.fontSize.text_16};
            }
          }
          & > div {
            color: ${({ theme }) => theme.workerColor.black};
          }
          & > div:nth-of-type(1) {
            width: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          & > div:nth-of-type(2) {
            width: 910px;
            padding-left: 30px;
            display: flex;
            align-items: center;
          }
          & > div:nth-of-type(3) {
            width: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .btn-wrapper {
        display: flex;
        justify-content: end;
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

interface IWorkerImpossible {
  onConfirm: () => void;
  workerStatus?: string;
}

const WorkerImpossible: React.FC<IWorkerImpossible> = ({ onConfirm, workerStatus }) => {
  const impossibleList = useRecoilValue(workerImpossibleListSelector);

  return (
    <Container>
      <div className="overlay" onClick={onConfirm} />
      <div className="modal-main">
        <div className="header">
          {workerStatus === 'IM' || workerStatus === 'IC' || workerStatus === 'NU' ? '작업 불가 사유' : '반려 사유'}
          <Close width="10" height="10" color={theme.workerColor.line2} onClick={onConfirm} />
        </div>
        <div className="body">
          <div className="content">
            <ul>
              <li className="header">
                <div>No</div>
                <div>사유</div>
                <div>시간</div>
              </li>
              {impossibleList.map((item, index) => (
                <li key={`impossible-${index}`}>
                  <div>{index + 1}</div>
                  <div>{item.reason}</div>
                  <div>{item.created}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="btn-wrapper">
            <Button className="submit-btn" variant="primary" onClick={onConfirm}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WorkerImpossible;
