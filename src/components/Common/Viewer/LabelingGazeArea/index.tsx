import { styled } from 'styled-components';
import { ILabelingAll } from 'types/worker-interface';

import LabelingVerbalItem from '../LabelingVerbalItem';

const LabelingGazeAreaWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 24px;
  background-color: #000;
  position: relative;
  margin-top: 12px;
`;

interface ILabelingGazeArea {
  list: ILabelingAll[];
}

const LabelingGazeArea: React.FC<ILabelingGazeArea> = ({ list }) => {
  return (
    <LabelingGazeAreaWrapper>
      {list.map((item) => (
        <LabelingVerbalItem key={item.verbal_id} startTime={item.start_time / 1000} endTime={item.end_time / 1000} />
      ))}
    </LabelingGazeAreaWrapper>
  );
};

export default LabelingGazeArea;
