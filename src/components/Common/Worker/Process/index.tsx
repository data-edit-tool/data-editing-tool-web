import React from 'react';
import classNames from 'classnames';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';

import CheckOn from 'components/SVG/Icon/CheckOn';

interface IProcess {
  step: number;
  status: 'wait' | 'process' | 'done' | '';
  text: string;
}

const ProcessWrapper = styled.div`
  .step {
    display: flex;
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
    border: 2px solid #3642a2;
    background-color: ${({ theme }) => theme.workerColor.white};
    box-shadow: 0 3px 6px 0 rgba(20, 21, 38, 0.17);
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 343px;
      height: 2px;
      background-color: ${({ theme }) => theme.workerColor.boxBorder};
      position: absolute;
      top: 50%;
      left: 202px;
      transform: translate(-50%, -50%);
    }
    span {
      color: ${({ theme }) => theme.workerColor.primary};
      font-size: ${({ theme }) => theme.fontSize.text_16};
      font-weight: bold;
    }
    &.wait {
      border: 2px solid ${({ theme }) => theme.workerColor.boxBorder};
      color: ${({ theme }) => theme.workerColor.white};
      background-color: ${({ theme }) => theme.workerColor.boxBorder};
      span {
        color: ${({ theme }) => theme.workerColor.white};
      }
    }
    &.process {
      border: 2px solid ${({ theme }) => theme.workerColor.primary};
    }
    &.done {
      background-color: ${({ theme }) => theme.workerColor.primary};
      &::after {
        background-color: ${({ theme }) => theme.workerColor.primary};
      }
    }
    &.last {
      &::after {
        display: none;
      }
    }
  }
  .label {
    margin-top: 12px;
    color: ${({ theme }) => theme.workerColor.white};
    font-size: ${({ theme }) => theme.fontSize.text_14};
    font-weight: 500;
    text-align: center;
  }
`;

// 헤더 step 상황에 따른 컴포넌트
const Process: React.FC<IProcess> = ({ step, status, text }) => {
  return (
    <ProcessWrapper>
      <div
        className={classNames('step', {
          wait: status === 'wait',
          process: status === 'process',
          done: status === 'done',
          last: step === 3,
        })}
      >
        {status === 'done' ? <CheckOn width="20" height="20" color={theme.workerColor.white} /> : <span>{step}</span>}
      </div>
      <div className="label">{text}</div>
    </ProcessWrapper>
  );
};

export default Process;
