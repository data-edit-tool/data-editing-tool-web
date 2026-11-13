/* eslint-disable indent */
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { useRecoilValue } from 'recoil';
import {
  workerLabelingAngleSelector,
  workerLabelingFuncSelector,
  workerLabelingGActionSelector,
  workerLabelingGObjectSelector,
  workerLabelingGSubjectSelector,
  workerLabelingIntentSelector,
  workerLabelingNonVerbalAffectiveSelector,
  workerLabelingNonVerbalEmotionSelector,
} from 'state/worker-labeling-category-list';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { ILabelingAll } from 'types/worker-interface';
import { useOnClickOutside } from 'usehooks-ts';
import { formatTime } from 'utils/time-format';

import Delete from 'components/SVG/Icon/Delete';
import PlayArrow from 'components/SVG/Icon/PlayArrow';

import LabelingSelect from '../LabelingSelect';

const NonVerbalLabelingItemWrapper = styled.li<{ active: string; error: string }>`
  ${({ active, theme }) => (active ? `background-color: ${theme.workerColor.primary} !important;` : '')}
  ${({ error, theme }) => (error ? `background-color: ${theme.workerColor.point};` : '')}
  position: relative;
  .action-input {
    border: none;
    height: 28px;
    padding: 5px 10px 5px 0;
    background-color: transparent;
    color: ${({ theme }) => theme.workerColor.txt2};
    font-size: ${({ theme }) => theme.fontSize.text_12};
    width: 57px;
    &::placeholder {
      color: #6d7080;
    }
  }
`;

interface INonVerbalLabelingItem {
  index: number;
  labeling: ILabelingAll;
  onClick: (ctrlStatus: boolean, nonVerbalId: string, startTime: number, endTime: number) => void;
  handleInputChange: (value: string, type: string, nonVerbalId: string) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, type: string, nonVerbalId: string) => void;
  active: string;
  process: boolean;
  onScroll: (top: number) => void;
  error: string;
  editRowLabelingId: string;
  onEditLabeling: (nonVerbalId: string, reset?: boolean) => void;
  onDeleteLabeling: (nonVerbalId: string) => void;
  onEditCancel: (nonVerbalId: string) => void;
  onEditSubmit: () => void;
  viewerType: boolean;
  workerType: string;
  handleSelectClick: (e: React.MouseEvent<HTMLSelectElement>, nonVerbalId: string) => void;
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

const NonVerbalLabelingItem: React.FC<INonVerbalLabelingItem> = ({
  index,
  labeling,
  onClick,
  handleInputChange,
  handleSelectChange,
  active,
  error,
  onScroll,
  process,
  editRowLabelingId,
  onEditLabeling,
  onDeleteLabeling,
  viewerType,
  workerType,
  handleSelectClick,
}) => {
  const gSubjectList = useRecoilValue(workerLabelingGSubjectSelector);
  const gActionList = useRecoilValue(workerLabelingGActionSelector);
  const gObjectList = useRecoilValue(workerLabelingGObjectSelector);
  const angleList = useRecoilValue(workerLabelingAngleSelector);
  const affectiveStateList = useRecoilValue(workerLabelingNonVerbalAffectiveSelector);
  const intentList = useRecoilValue(workerLabelingIntentSelector);
  const funcList = useRecoilValue(workerLabelingFuncSelector);
  const emotionList = useRecoilValue(workerLabelingNonVerbalEmotionSelector);

  const [optionBoxLeft, setOptionBoxLeft] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const nonVerbalLabelingRef = useRef<HTMLLIElement>(null);

  const ref = useRef(null);

  // 마우스 오른쪽 버튼 누른후 다른영역 클릭시 닫기
  const handleClickOutside = () => {
    if (labeling.nonverbal_id === editRowLabelingId) {
      onEditLabeling('');
      setIsEdit(false);
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    // 오디오 재생하면서 라벨링 리스트 항목 이동
    if (process && nonVerbalLabelingRef.current) {
      onScroll(nonVerbalLabelingRef.current.offsetTop - 300 > 0 ? nonVerbalLabelingRef.current.offsetTop - 300 : 0);
    }
  }, [process]);

  // 삭제 이벤트
  const handleDeleteLabeling = (nonVerbalId: string) => {
    setIsEdit(false);
    onDeleteLabeling(nonVerbalId);
  };

  // 재생시 아이콘 분기처리
  const onProcessAndEdit = useCallback(() => {
    // 재생중
    if (process) {
      return <PlayArrow width="5" height="6" color={theme.workerColor.timeline} />;
    }
    return null;
  }, [process]);

  // 오른쪽 버튼 눌렀을때
  const handleContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    // 워커 및 viewerType은 해당사항 없음
    if (viewerType || workerType === 'W') {
      return;
    }
    e.preventDefault();
    onEditLabeling(labeling.nonverbal_id, true);
    setIsEdit(true);
    setOptionBoxLeft(e.pageX - 960);
    onClick(e.ctrlKey || e.metaKey, labeling.nonverbal_id, labeling.start_time, labeling.end_time);
  };

  const handleSelectBoxClick = (e: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
    handleSelectClick(e, labeling.nonverbal_id);
  };

  const handleItemClick = (e: React.MouseEvent<HTMLLIElement>) => {
    onClick(e.ctrlKey || e.metaKey, labeling.nonverbal_id, labeling.start_time, labeling.end_time);
  };

  return (
    <NonVerbalLabelingItemWrapper
      ref={nonVerbalLabelingRef}
      active={active}
      error={error}
      onClick={handleItemClick}
      onContextMenu={handleContextMenu}
      id={labeling.nonverbal_id}
    >
      {editRowLabelingId === labeling.nonverbal_id && isEdit && (
        <span className="edit_option" style={{ left: optionBoxLeft }} ref={ref}>
          <ul>
            <li onClick={() => handleDeleteLabeling(labeling.nonverbal_id)}>
              <span>Remove section</span>
              <Delete width="18" height="18" color={theme.workerColor.white} />
            </li>
          </ul>
        </span>
      )}
      <div>{onProcessAndEdit()}</div>
      <div>{index + 1}.</div>
      <div>
        <LabelingSelect
          id={`gSubject-${index}`}
          defaultOption
          width="82px"
          list={gSubjectList}
          value={labeling.subject}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'subject', labeling.nonverbal_id)}
          eventBlock={(viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V'}
          handleClick={handleSelectBoxClick}
        />
        {labeling.subject && viewerType && (
          <Tooltip place="top" anchorSelect={`#gSubject-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{gSubjectList.find((item) => item.ctg_id === labeling.subject)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`gAction-${index}`}
          defaultOption
          width="82px"
          list={
            labeling.subject
              ? gActionList
                  .filter((action) => action.ctg_parent_id === labeling.subject)
                  .map((action) => ({
                    ctg_id: action.ctg_id,
                    ctg_name: action.ctg_name,
                    ctg_depth: [],
                  }))
              : []
          }
          value={labeling.action}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'action', labeling.nonverbal_id)}
          eventBlock={(viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V'}
          handleClick={handleSelectBoxClick}
        />
        <input
          type="text"
          className="action-input"
          placeholder="추가 입력"
          value={labeling.action_str || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value, 'action_str', labeling.nonverbal_id)}
          style={{
            pointerEvents: (viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V' ? 'none' : 'auto',
          }}
          disabled={!(labeling.action === '64c856df000000000075bba4' || labeling.action === '64c856df000000000075bbb9')}
        />
        {labeling.subject && labeling.action && viewerType && (
          <Tooltip place="top" anchorSelect={`#gAction-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>
              {gActionList.filter((action) => action.ctg_parent_id === labeling.subject).find((item) => item.ctg_id === labeling.action)?.ctg_name}
            </div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`gObject-${index}`}
          defaultOption
          width="82px"
          list={gObjectList}
          value={labeling.obj}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'obj', labeling.nonverbal_id)}
          eventBlock={(viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V'}
          handleClick={handleSelectBoxClick}
        />
        {labeling.obj && viewerType && (
          <Tooltip place="top" anchorSelect={`#gObject-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{gObjectList.find((item) => item.ctg_id === labeling.obj)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`gAngle-${index}`}
          defaultOption
          width="82px"
          list={angleList}
          value={labeling.angle}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'angle', labeling.nonverbal_id)}
          eventBlock={(viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V'}
          handleClick={handleSelectBoxClick}
        />
        {labeling.angle && viewerType && (
          <Tooltip place="top" anchorSelect={`#gAngle-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{angleList.find((item) => item.ctg_id === labeling.angle)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`affectiveState-${index}`}
          defaultOption
          width="82px"
          list={affectiveStateList}
          value={labeling.affective_state}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'affective_state', labeling.nonverbal_id)}
          eventBlock={(viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V'}
          handleClick={handleSelectBoxClick}
        />
        {labeling.affective_state && viewerType && (
          <Tooltip place="top" anchorSelect={`#affectiveState-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{affectiveStateList.find((item) => item.ctg_id === labeling.affective_state)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`intent-${index}`}
          defaultOption
          width="82px"
          list={intentList}
          value={labeling.intent}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'intent', labeling.nonverbal_id)}
          eventBlock={(viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V'}
          handleClick={handleSelectBoxClick}
        />
        {labeling.intent && viewerType && (
          <Tooltip place="top" anchorSelect={`#intent-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{intentList.find((item) => item.ctg_id === labeling.intent)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`func-${index}`}
          defaultOption
          width="82px"
          list={funcList}
          value={labeling.func}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'func', labeling.nonverbal_id)}
          eventBlock={(viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V'}
          handleClick={handleSelectBoxClick}
        />
        {labeling.func && viewerType && (
          <Tooltip place="top" anchorSelect={`#func-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{funcList.find((item) => item.ctg_id === labeling.func)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>
        <LabelingSelect
          id={`emotion-${index}`}
          defaultOption
          width="82px"
          list={emotionList}
          value={labeling.emotion}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'emotion', labeling.nonverbal_id)}
          eventBlock={(viewerType && isNaN(Number(labeling.nonverbal_id))) || workerType === 'V'}
          handleClick={handleSelectBoxClick}
        />
        {labeling.emotion && viewerType && (
          <Tooltip place="top" anchorSelect={`#emotion-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{emotionList.find((item) => item.ctg_id === labeling.emotion)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>{formatTime(labeling.start_time)}</div>
      <div>{formatTime(labeling.end_time)}</div>
    </NonVerbalLabelingItemWrapper>
  );
};

function propsAreEqual(prevProps: INonVerbalLabelingItem, nextProps: INonVerbalLabelingItem) {
  return (
    prevProps.index === nextProps.index &&
    JSON.stringify(prevProps.labeling) === JSON.stringify(nextProps.labeling) &&
    prevProps.active === nextProps.active &&
    prevProps.process === nextProps.process &&
    prevProps.error === nextProps.error &&
    prevProps.workerType === nextProps.workerType &&
    prevProps.editRowLabelingId === nextProps.editRowLabelingId &&
    prevProps.viewerType === nextProps.viewerType &&
    prevProps.workerType === nextProps.workerType &&
    JSON.stringify(prevProps.selectedSection) === JSON.stringify(nextProps.selectedSection) &&
    JSON.stringify(prevProps.currentSection) === JSON.stringify(nextProps.currentSection)
  );
}

const NonVerbalLabelingItemMemo = memo(NonVerbalLabelingItem, propsAreEqual);

export default NonVerbalLabelingItemMemo;
