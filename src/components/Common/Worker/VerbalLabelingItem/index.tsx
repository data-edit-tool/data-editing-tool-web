import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import {
  workerLabelingAffectiveSelector,
  workerLabelingBcIntentSelector,
  workerLabelingChannelSelector,
  workerLabelingEmotionSelector,
  workerLabelingFcIntentSelector,
  workerLabelingSentimentSelector,
} from 'state/worker-labeling-category-list';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { ILabelingAll } from 'types/worker-interface';
import { useOnClickOutside } from 'usehooks-ts';
import { formatTime } from 'utils/time-format';

import Delete from 'components/SVG/Icon/Delete';
import PlayArrow from 'components/SVG/Icon/PlayArrow';

import Button from '../Button';
import LabelingSelect from '../LabelingSelect';

const VerbalLabelingItemWrapper = styled.li<{ active: string; error: string }>`
  ${({ active, theme }) => (active ? `background-color: ${theme.workerColor.primary} !important;` : '')}
  ${({ error, theme }) => (error ? `background-color: ${theme.workerColor.point};` : '')}
  position: relative;
  .input-wrapper {
    min-width: 100px;
    max-width: 430px;
    z-index: 1;
    display: inline-block;
    position: absolute;
    top: 3px;
    left: 87px;
    min-height: 26.5px;
    background-color: ${theme.workerColor.white};
    border-radius: 4px;
    line-height: 20px;
    .input-outline {
      color: #141519;
      font-size: ${theme.fontSize.text_18};
      padding: 5px 10px;
      display: block;
      &:focus {
        outline: none;
      }
    }
  }
  button {
    &.selected {
      background-color: #33a87b;
      &.viewer {
        background-color: ${theme.workerColor.white};
        color: ${theme.workerColor.primary};
        font-weight: 500;
        &:hover {
          background-color: ${theme.workerColor.white};
          color: ${theme.workerColor.primary};
        }
      }
      &:hover {
        background-color: #33a87b;
      }
    }
  }
`;

interface IVerbalLabelingItem {
  index: number;
  labeling: ILabelingAll;
  handleInputChange: (value: string, type: string, verbalId: string) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, type: string) => void;
  onModalClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: 'verbal_vad' | 'overall_vad',
    labelingId: string,
    sentence: string,
    data: {
      valence: number;
      arousal: number;
      dominance: number;
    } | null,
  ) => void;
  onClick: (ctrlStatus: boolean, verbalId: string, startTime: number, endTime: number) => void;
  active: string;
  process: boolean;
  onScroll: (top: number) => void;
  error: string;
  editRowLabelingId: string;
  onEditLabeling: (verbalId: string, reset?: boolean) => void;
  onDeleteLabeling: (verbalId: string) => void;
  workerType: string;
  onEditCancel: (verbalId: string) => void;
  onEditSubmit: () => void;
  viewerType: boolean;
  workerStatus: string;
  handleSelectClick: (e: React.MouseEvent<HTMLSelectElement>, verbalId: string) => void;
  selectedSection: {
    id: string;
    startTime: number;
    endTime: number;
  }[];
  currentSection: {
    id: string;
    startTime: number;
    endTime: number;
  } | null;
}

const VerbalLabelingItem: React.FC<IVerbalLabelingItem> = ({
  index,
  labeling,
  handleInputChange,
  handleSelectChange,
  onModalClick,
  onClick,
  active,
  process,
  onScroll,
  error,
  editRowLabelingId,
  onEditLabeling,
  onDeleteLabeling,
  workerType,
  viewerType,
  handleSelectClick,
  // workerStatus,
}) => {
  const [isInput, setIsInput] = useState(false);
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const affectiveList = useRecoilValue(workerLabelingAffectiveSelector);
  const channelList = useRecoilValue(workerLabelingChannelSelector);
  const sentimentList = useRecoilValue(workerLabelingSentimentSelector);
  const bcIntentList = useRecoilValue(workerLabelingBcIntentSelector);
  const fcIntentList = useRecoilValue(workerLabelingFcIntentSelector);
  const emotionList = useRecoilValue(workerLabelingEmotionSelector);
  const [optionBoxLeft, setOptionBoxLeft] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const ref = useRef(null);
  const [isVerbalSentence, setIsVerbalSentence] = useState<string>('');
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // 레이어가 있을경우 다른곳 클릭이면 닫기
  const handleClickOutside = () => {
    if (labeling.verbal_id === editRowLabelingId) {
      onEditLabeling('');
      setIsEdit(false);
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  const verbalLabelingRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    return () => {
      // 더블클릭
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);

  useEffect(() => {
    // 재생중일때 스크롤 이동
    if (process && verbalLabelingRef.current) {
      onScroll(verbalLabelingRef.current.offsetTop - 300 > 0 ? verbalLabelingRef.current.offsetTop - 300 : 0);
    }
  }, [process]);

  // verbal vad 모달 오픈
  const handleVerbalModalOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onModalClick(e, 'verbal_vad', labeling.verbal_id, labeling.sentence, labeling.verbal_vad);
    },
    [index, labeling.sentence, labeling.verbal_vad, onModalClick],
  );

  // overall vad 모달 오픈
  const handleOverallModalOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onModalClick(e, 'overall_vad', labeling.verbal_id, labeling.sentence, labeling.overall_vad);
    },
    [index, labeling.overall_vad, labeling.sentence, onModalClick],
  );

  // input blur
  const onBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    handleInputChange((e.target as HTMLSpanElement).innerText, 'sentence', labeling.verbal_id);
    setIsInput(false);
  };

  const handleInputOutside = () => {
    handleInputChange(spanRef.current?.innerText as string, 'sentence', labeling.verbal_id);
    setIsInput(false);
  };

  useOnClickOutside(inputRef, handleInputOutside);

  // 인풋 더블클릭 확인
  const handleClick = () => {
    const delay = 300;
    if (!isInput) {
      if (clickTimer) {
        clearTimeout(clickTimer);
        setClickTimer(null);
        setIsInput(true);
        setIsVerbalSentence(labeling.sentence);
        setTimeout(() => {
          if (spanRef.current) {
            const textNode = spanRef.current.childNodes[0] as Text;
            const range = document.createRange();
            const selection = window.getSelection();

            if (textNode) {
              range.setStart(textNode, textNode.length);
              range.collapse(true);
              selection?.removeAllRanges();
              selection?.addRange(range);
            } else {
              spanRef.current.focus();
            }
          }
        }, 0);
      } else {
        const timer = setTimeout(() => {
          setClickTimer(null);
        }, delay);

        setClickTimer(timer);
      }
    }
  };

  // 마우스 오른쪽 버튼
  const handleContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    // 뷰어 및 작업자는 안나옴
    if (viewerType || workerType === 'W') {
      return;
    }
    e.preventDefault();
    onEditLabeling(labeling.verbal_id, true);
    setIsEdit(true);
    setOptionBoxLeft(e.pageX - 960);
    onClick(e.ctrlKey || e.metaKey, labeling.verbal_id, labeling.start_time, labeling.end_time);
  };

  // 재생중 상태와 수정중인 상태일때 아이콘 표시
  const onProcessAndEdit = useCallback(() => {
    if (process) {
      return <PlayArrow width="5" height="6" color={theme.workerColor.timeline} />;
    }
    return null;
  }, [process]);

  // select change
  const handleEditSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {
    // console.log(labeling.verbal_id);
    // if (isNaN(Number(labeling.verbal_id))) {
    //   return;
    // }
    handleSelectChange(e, type);
  };

  const handleDeleteLabeling = (verbalId: string) => {
    setIsEdit(false);
    onDeleteLabeling(verbalId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      //   setIsVerbalSentence(spanRef.current.textContent as string);
      // setIsVerbalSentence((e.target as HTMLSpanElement).innerText);
      handleInputChange((e.target as HTMLSpanElement).innerText, 'sentence', labeling.verbal_id);
      setIsInput(false);
    }
    if (e.key === 'Escape') {
      setIsInput(false);
    }
  };

  return (
    <VerbalLabelingItemWrapper
      onClick={(e: React.MouseEvent<HTMLLIElement>) => onClick(e.ctrlKey || e.metaKey, labeling.verbal_id, labeling.start_time, labeling.end_time)}
      onContextMenu={handleContextMenu}
      active={active}
      ref={verbalLabelingRef}
      error={error}
      id={labeling.verbal_id}
    >
      {editRowLabelingId === labeling.verbal_id && isEdit && (
        <span className="edit_option" style={{ left: optionBoxLeft }} ref={ref}>
          <ul>
            <li onClick={() => handleDeleteLabeling(labeling.verbal_id)}>
              <span>Remove section</span>
              <Delete width="18" height="18" color={theme.workerColor.white} />
            </li>
          </ul>
        </span>
      )}
      <div>{onProcessAndEdit()}</div>
      <div>{index + 1}.</div>
      <div
        onClick={handleClick}
        style={{
          pointerEvents: 'auto',
        }}
      >
        {/* <WorkerInput className="sentence-input" value={labeling.sentence} /> */}
        {isInput ? (
          <div className="input-wrapper" ref={inputRef}>
            <span
              role="textbox"
              contentEditable={workerType === 'V' ? false : true}
              className="input-outline"
              onKeyDown={(e) => handleKeyDown(e)}
              onBlur={onBlur}
              ref={spanRef}
              suppressContentEditableWarning
              // onInput={handleSentenceChange}
            >
              {isVerbalSentence}
            </span>
          </div>
        ) : (
          <span>{labeling.sentence}</span>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`affective-${index}`}
          defaultOption
          width="102px"
          list={affectiveList}
          value={labeling.affective_state}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEditSelectChange(e, 'affective_state')}
          eventBlock={(viewerType && isNaN(Number(labeling.verbal_id))) || workerType === 'V'}
          handleClick={(e) => handleSelectClick(e, labeling.verbal_id)}
        />
        {labeling.affective_state && viewerType && (
          <Tooltip place="top" anchorSelect={`#affective-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{affectiveList.find((item) => item.ctg_id === labeling.affective_state)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`channel-${index}`}
          defaultOption
          width="102px"
          list={channelList}
          value={labeling.channel}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEditSelectChange(e, 'channel')}
          eventBlock={(viewerType && isNaN(Number(labeling.verbal_id))) || workerType === 'V'}
          handleClick={(e) => handleSelectClick(e, labeling.verbal_id)}
        />
        {labeling.channel && viewerType && (
          <Tooltip place="top" anchorSelect={`#channel-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{channelList.find((item) => item.ctg_id === labeling.channel)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`sentiment-${index}`}
          defaultOption
          width="102px"
          list={sentimentList}
          value={labeling.sentiment}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEditSelectChange(e, 'sentiment')}
          eventBlock={(viewerType && isNaN(Number(labeling.verbal_id))) || workerType === 'V'}
          handleClick={(e) => handleSelectClick(e, labeling.verbal_id)}
        />
        {labeling.sentiment && viewerType && (
          <Tooltip place="top" anchorSelect={`#sentiment-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{sentimentList.find((item) => item.ctg_id === labeling.sentiment)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`fcIntent-${index}`}
          defaultOption
          width="102px"
          list={fcIntentList}
          value={labeling.fc_intent}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEditSelectChange(e, 'fc_intent')}
          eventBlock={(viewerType && isNaN(Number(labeling.verbal_id))) || workerType === 'V'}
          handleClick={(e) => handleSelectClick(e, labeling.verbal_id)}
        />
        {labeling.fc_intent && viewerType && (
          <Tooltip place="top" anchorSelect={`#fcIntent-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{fcIntentList.find((item) => item.ctg_id === labeling.fc_intent)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`bcIntent-${index}`}
          defaultOption
          width="102px"
          list={bcIntentList}
          value={labeling.bc_intent}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEditSelectChange(e, 'bc_intent')}
          eventBlock={(viewerType && isNaN(Number(labeling.verbal_id))) || workerType === 'V'}
          handleClick={(e) => handleSelectClick(e, labeling.verbal_id)}
        />
        {labeling.bc_intent && viewerType && (
          <Tooltip place="top" anchorSelect={`#bcIntent-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{bcIntentList.find((item) => item.ctg_id === labeling.bc_intent)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`emotion-${index}`}
          defaultOption
          width="102px"
          list={emotionList}
          value={labeling.emotion}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEditSelectChange(e, 'emotion')}
          eventBlock={(viewerType && isNaN(Number(labeling.verbal_id))) || workerType === 'V'}
          handleClick={(e) => handleSelectClick(e, labeling.verbal_id)}
        />
        {labeling.emotion && viewerType && (
          <Tooltip place="top" anchorSelect={`#emotion-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{emotionList.find((item) => item.ctg_id === labeling.emotion)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div
        style={
          {
            // pointerEvents: viewerType && isNaN(Number(labeling.verbal_id)) && workerType === 'V' ? 'none' : 'auto',
          }
        }
      >
        <Button
          className={classNames({ selected: labeling.verbal_vad, viewer: labeling.verbal_vad && workerType === 'V' })}
          variant="secondary"
          size="s"
          onClick={handleVerbalModalOpen}
        >
          {labeling.verbal_vad ? (workerType === 'V' ? '선택보기' : '선택완료') : '선택'}
        </Button>
      </div>
      <div
        style={
          {
            // pointerEvents: workerStatus === 'IS' && isNaN(Number(labeling.verbal_id)) ? 'none' : 'auto',
            // pointerEvents: isNaN(Number(labeling.verbal_id)) ? 'none' : 'auto',
          }
        }
      >
        <Button
          className={classNames({ selected: labeling.overall_vad, viewer: labeling.overall_vad && workerType === 'V' })}
          variant="secondary"
          size="s"
          onClick={handleOverallModalOpen}
        >
          {labeling.overall_vad ? (workerType === 'V' ? '선택보기' : '선택완료') : '선택'}
        </Button>
      </div>
      <div>{formatTime(labeling.start_time)}</div>
      <div>{formatTime(labeling.end_time)}</div>
    </VerbalLabelingItemWrapper>
  );
};

function propsAreEqual(prevProps: IVerbalLabelingItem, nextProps: IVerbalLabelingItem) {
  return (
    prevProps.index === nextProps.index &&
    JSON.stringify(prevProps.labeling) === JSON.stringify(nextProps.labeling) &&
    prevProps.active === nextProps.active &&
    prevProps.process === nextProps.process &&
    prevProps.error === nextProps.error &&
    prevProps.workerType === nextProps.workerType &&
    prevProps.editRowLabelingId === nextProps.editRowLabelingId &&
    prevProps.viewerType === nextProps.viewerType &&
    prevProps.workerStatus === nextProps.workerStatus &&
    JSON.stringify(prevProps.selectedSection) === JSON.stringify(nextProps.selectedSection) &&
    JSON.stringify(prevProps.currentSection) === JSON.stringify(nextProps.currentSection)
  );
}

const VerbalLabelingItemMemo = memo(VerbalLabelingItem, propsAreEqual);

export default VerbalLabelingItemMemo;
