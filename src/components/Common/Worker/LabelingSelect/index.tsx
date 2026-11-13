import React from 'react';
import { styled } from 'styled-components';
import { IJobCategoryListDepth } from 'types/worker-interface';

const LabelingSelectWrapper = styled.div<{ width: string; $arrowNone?: boolean }>`
  display: flex;
  width: ${({ width }) => width};
  select {
    width: 100%;
    padding: 6px;
    text-align: center;
    background: transparent;
    background-image: ${({ $arrowNone }) =>
      $arrowNone
        ? 'none'
        : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><path data-name='사각형 2259' style='fill:none' d='M0 0h24v24H0z'/><path data-name='패스 3032' d='M11.969 192h8.662a.694.694 0 0 1 .475 1.181l-4.329 4.457a.661.661 0 0 1-.953 0l-4.329-4.457a.694.694 0 0 1 .474-1.181z' transform='translate(-4.295 -183)' style='fill:darkgrey'/></svg>")`};
    background-repeat: no-repeat;
    background-position-x: 100%;
    background-position-y: 1px;
    border: 0px;
    color: ${({ theme }) => theme.workerColor.txt2};
    outline: 0;
    font-size: ${({ theme }) => theme.fontSize.text_12};
    -webkit-appearance: none;
    -moz-appearance: none;
  }
`;

interface ILabelingSelect {
  id?: string;
  width: string;
  list: IJobCategoryListDepth[];
  value?: string;
  defaultOption?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleClick: (e: React.MouseEvent<HTMLSelectElement>) => void;
  eventBlock?: boolean;
  arrowNone?: boolean;
}

const LabelingSelect: React.FC<ILabelingSelect> = ({ id, width, list, value, defaultOption, handleChange, handleClick, eventBlock, arrowNone }) => {
  return (
    <LabelingSelectWrapper width={width} id={id} $arrowNone={arrowNone}>
      <select value={value} onChange={handleChange} onClick={handleClick} style={{ pointerEvents: eventBlock ? 'none' : undefined }}>
        {defaultOption && <option value="">{'<select>'}</option>}
        {list.map((item) => (
          <option value={item.ctg_id} key={item.ctg_id}>
            {item.ctg_name}
          </option>
        ))}
      </select>
    </LabelingSelectWrapper>
  );
};

LabelingSelect.defaultProps = {
  list: [],
  value: '',
};

export default LabelingSelect;
