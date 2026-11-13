import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { theme } from 'styles/theme';

import Button from 'components/Common/Worker/Button';
import Close from 'components/SVG/Icon/Close';

const Container = styled.div`
  .modal-main {
    z-index: 5002;
    width: 100%;
    max-width: 540px;
    border-radius: 6px;
    background-color: ${({ theme }) => theme.workerColor.white};
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
        .title {
          background-color: #edeff4;
          text-align: center;
          padding: 10px 0px;
          color: ${({ theme }) => theme.workerColor.black};
          font-size: ${({ theme }) => theme.fontSize.text_14};
        }
        .option {
          margin-top: 20px;
          .option-item {
            text-align: center;
            .option-title {
              color: #26282b;
              font-size: 13px;
              text-align: left;
            }
            img {
              width: 97%;
              margin-top: 10px;
            }
            ul.option-radio {
              display: flex;
              li {
                width: 25%;
                display: flex;
                justify-content: center;
                .radio {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  position: relative;
                  border: 1.5px solid ${({ theme }) => theme.workerColor.line2};
                  &.active {
                    border: 1.5px solid ${({ theme }) => theme.workerColor.primary};
                    .radio-inner {
                      display: block;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      width: 10px;
                      height: 10px;
                      border-radius: 50%;
                      background-color: ${({ theme }) => theme.workerColor.primary};
                    }
                  }
                  .radio-inner {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
      .btn-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        button {
          width: 120px;
          &.cancel-btn {
            margin-right: 20px;
            background-color: #dddee0;
            color: #565e6a;
            &.mr-0 {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
`;

interface IWorkerVerbalVAD {
  onConfirm: (valence: number, arousal: number, dominance: number, viewerType: boolean) => void;
  onCancel: () => void;
  title: string;
  type: 'verbal_vad' | 'overall_vad';
  data: {
    valence: number;
    arousal: number;
    dominance: number;
  } | null;
  viewerType: boolean;
  verbalId: string | number;
}

const WorkerVerbalVAD: React.FC<IWorkerVerbalVAD> = ({ onConfirm, onCancel, title, type, data, viewerType, verbalId }) => {
  const [selectValence, setSelectValence] = useState<number>(data ? data.valence : -1);
  const [selectArousal, setSelectArousal] = useState<number>(data ? data.arousal : -1);
  const [selectDominance, setSelectDominance] = useState<number>(data ? data.dominance : -1);

  useEffect(() => {
    if (data) {
      setSelectValence(data.valence);
      setSelectArousal(data.arousal);
      setSelectDominance(data.dominance);
    } else {
      setSelectValence(-1);
      setSelectArousal(-1);
      setSelectDominance(-1);
    }
  }, [verbalId, type]);

  // viewType이면 변경 불가
  const handleValenceSelect = (index: number) => {
    if (viewerType) {
      return;
    }
    setSelectValence(index);
  };

  // viewType이면 변경 불가
  const handleArousalSelect = (index: number) => {
    if (viewerType) {
      return;
    }
    setSelectArousal(index);
  };

  // viewType이면 변경 불가
  const handleDominanceSelect = (index: number) => {
    if (viewerType) {
      return;
    }
    setSelectDominance(index);
  };

  const onSubmit = () => {
    onConfirm(selectValence, selectArousal, selectDominance, viewerType);
  };

  return (
    <Container>
      <div className="modal-main">
        <div className="header">
          {type === 'verbal_vad' ? 'Verbal_VAD' : 'Overall_VAD'}
          <Close width="10" height="10" color={theme.workerColor.line2} onClick={onCancel} />
        </div>
        <div className="body">
          <div className="content">
            <div className="title">{title}</div>
            <div className="option">
              <div className="option-item">
                <div className="option-title">Valence</div>
                <img src="/images/img-valence.png" alt="valence" />
                <ul className="option-radio">
                  {Array.from({ length: 5 }, (_, i) => (
                    <li key={`valence-${i}`} onClick={() => handleValenceSelect(i)}>
                      <div className={classNames('radio', { active: selectValence === i })}>{selectValence === i && <div className="radio-inner" />}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="option-item">
                <div className="option-title">Arousal</div>
                <img src="/images/img-arousal.png" alt="Arousal" />
                <ul className="option-radio">
                  {Array.from({ length: 5 }, (_, i) => (
                    <li key={`arousal-${i}`} onClick={() => handleArousalSelect(i)}>
                      <div className={classNames('radio', { active: selectArousal === i })}>{selectArousal === i && <div className="radio-inner" />}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="option-item">
                <div className="option-title">Dominance</div>
                <img src="/images/img-dominance.png" alt="Dominance" />
                <ul className="option-radio">
                  {Array.from({ length: 5 }, (_, i) => (
                    <li key={`dominance-${i}`} onClick={() => handleDominanceSelect(i)}>
                      <div className={classNames('radio', { active: selectDominance === i })}>{selectDominance === i && <div className="radio-inner" />}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="btn-wrapper">
            <Button
              className={classNames('cancel-btn', {
                'mr-0': viewerType,
              })}
              variant="primary"
              onClick={onCancel}
            >
              나가기
            </Button>
            {!viewerType && (
              <Button
                className="submit-btn"
                variant="primary"
                onClick={onSubmit}
                disabled={selectValence === -1 || selectArousal === -1 || selectDominance === -1}
              >
                선택 완료
              </Button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WorkerVerbalVAD;
