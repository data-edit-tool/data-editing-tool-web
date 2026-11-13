import { styled } from 'styled-components';
import { ILabelingAll } from 'types/worker-interface';

import LabelingVerbalItem from '../LabelingVerbalItem';

const LabelingParaNonAreaWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 24px;
  background-color: #000;
  position: relative;
  margin-top: 8px;
`;

interface ILabelingParaNonArea {
  list: ILabelingAll[];
  type: 'paraverbal' | 'gSubject';
  index: number;
}

const LabelingParaNonArea: React.FC<ILabelingParaNonArea> = ({ list, index, type }) => {
  return (
    <LabelingParaNonAreaWrapper>
      {list.map((item) => (
        <LabelingVerbalItem
          key={`${type}-list-labeling-${index}-${type === 'paraverbal' ? item.paraverbal_id : item.nonverbal_id}`}
          sectionId={type === 'paraverbal' ? item.paraverbal_id : item.nonverbal_id}
          startTime={item.start_time / 1000}
          endTime={item.end_time / 1000}
        />
      ))}
    </LabelingParaNonAreaWrapper>
  );
};

export default LabelingParaNonArea;
