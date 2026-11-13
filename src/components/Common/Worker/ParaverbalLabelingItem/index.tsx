import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { useRecoilValue } from 'recoil';
import { workerLabelingParaverbalSelector } from 'state/worker-labeling-category-list';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { ILabelingAll } from 'types/worker-interface';
import { useOnClickOutside } from 'usehooks-ts';
import { formatTime } from 'utils/time-format';

import Delete from 'components/SVG/Icon/Delete';
import PlayArrow from 'components/SVG/Icon/PlayArrow';

import LabelingSelect from '../LabelingSelect';

interface IParaverbalLabelingItem {
  index: number;
  labeling: ILabelingAll;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, type: string, paraverbalId: string) => void;
  onClick: (ctrlStatus: boolean, verbalId: string, startTime: number, endTime: number) => void;
  active: string;
  process: boolean;
  onScroll: (top: number) => void;
  editRowLabelingId: string;
  onEditLabeling: (paraverbalId: string, reset?: boolean) => void;
  onDeleteLabeling: (paraverbalId: string) => void;
  onEditCancel: (paraverbalId: string) => void;
  onEditSubmit: () => void;
  viewerType: boolean;
  workerType: string;
  handleSelectClick: (e: React.MouseEvent<HTMLSelectElement>, paraverbalId: string) => void;
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

const ParaverbalLabelingItemWrapper = styled.li<{ active: string }>`
  ${({ active, theme }) => (active ? `background-color: ${theme.workerColor.primary} !important;` : '')}
  position: relative;
  .select-box {
    width: auto;
    height: 28px;
    & > div {
      height: 28px;
      border: 0;
      background-color: transparent;
    }
  }
`;

const ParaverbalLabelingItem: React.FC<IParaverbalLabelingItem> = ({
  index,
  labeling,
  handleSelectChange,
  onClick,
  active,
  process,
  onScroll,
  editRowLabelingId,
  onEditLabeling,
  onDeleteLabeling,
  viewerType,
  workerType,
  handleSelectClick,
}) => {
  const paraverbalList = useRecoilValue(workerLabelingParaverbalSelector);

  const paraverbalLabelingRef = useRef<HTMLLIElement>(null);
  const [optionBoxLeft, setOptionBoxLeft] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const ref = useRef(null);

  // 수정시 다른영역 클릭시 닫기
  const handleClickOutside = () => {
    if (labeling.paraverbal_id === editRowLabelingId) {
      onEditLabeling('');
      setIsEdit(false);
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    // 오디오 재생하면서 라벨링 리스트 항목 이동
    if (process && paraverbalLabelingRef.current) {
      onScroll(paraverbalLabelingRef.current.offsetTop - 300 > 0 ? paraverbalLabelingRef.current.offsetTop - 300 : 0);
    }
  }, [process]);

  // 오른쪽 버튼 눌렀을때
  const handleContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (viewerType && workerType === 'W') {
      return;
    }
    e.preventDefault();
    onEditLabeling(labeling.paraverbal_id, true);
    setIsEdit(true);
    setOptionBoxLeft(e.pageX - 960);
    onClick(e.ctrlKey || e.metaKey, labeling.paraverbal_id, labeling.start_time, labeling.end_time);
  };

  // 재생시 아이콘 분기처리
  const onProcessAndEdit = useCallback(() => {
    // 재생
    if (process) {
      return <PlayArrow width="5" height="6" color={theme.workerColor.timeline} />;
    }
    return null;
  }, [process, labeling.paraverbal_id]);

  // 삭제 이벤트
  const handleDeleteLabeling = (paraverbalId: string) => {
    setIsEdit(false);
    onDeleteLabeling(paraverbalId);
  };

  return (
    <ParaverbalLabelingItemWrapper
      onClick={(e: React.MouseEvent<HTMLLIElement>) => onClick(e.ctrlKey || e.metaKey, labeling.paraverbal_id, labeling.start_time, labeling.end_time)}
      active={active}
      onContextMenu={handleContextMenu}
      ref={paraverbalLabelingRef}
      id={labeling.paraverbal_id}
    >
      {editRowLabelingId === labeling.paraverbal_id && isEdit && (
        <span className="edit_option" style={{ left: optionBoxLeft }} ref={ref}>
          <ul>
            <li onClick={() => handleDeleteLabeling(labeling.paraverbal_id)}>
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
          id={`paraFunc-${index}`}
          width="auto"
          list={paraverbalList}
          handleChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(e, 'func', labeling.paraverbal_id)}
          value={labeling.func}
          eventBlock={viewerType && isNaN(Number(labeling.paraverbal_id)) && workerType === 'V'}
          handleClick={(e) => handleSelectClick(e, labeling.paraverbal_id)}
        />
        {labeling.func && viewerType && (
          <Tooltip place="top" anchorSelect={`#paraFunc-${index}`} style={{ background: 'black', zIndex: 3 }}>
            <div style={{ fontSize: '14px', color: 'white' }}>{paraverbalList.find((item) => item.ctg_id === labeling.func)?.ctg_name}</div>
          </Tooltip>
        )}
      </div>
      <div>{formatTime(labeling.start_time)}</div>
      <div>{formatTime(labeling.end_time)}</div>
    </ParaverbalLabelingItemWrapper>
  );
};

function propsAreEqual(prevProps: IParaverbalLabelingItem, nextProps: IParaverbalLabelingItem) {
  return (
    prevProps.index === nextProps.index &&
    JSON.stringify(prevProps.labeling) === JSON.stringify(nextProps.labeling) &&
    prevProps.active === nextProps.active &&
    prevProps.process === nextProps.process &&
    prevProps.editRowLabelingId === nextProps.editRowLabelingId &&
    prevProps.viewerType === nextProps.viewerType &&
    prevProps.workerType === nextProps.workerType &&
    JSON.stringify(prevProps.selectedSection) === JSON.stringify(nextProps.selectedSection) &&
    JSON.stringify(prevProps.currentSection) === JSON.stringify(nextProps.currentSection)
  );
}

const ParaverbalLabelingItemMemo = memo(ParaverbalLabelingItem, propsAreEqual);

export default ParaverbalLabelingItemMemo;
