import { styled } from 'styled-components';
import { ILabelingAll } from 'types/worker-interface';

import LabelingVerbalItem from '../LabelingVerbalItem';

const LabelingVerbalAreaWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 24px;
  background-color: ${({ theme }) => theme.workerColor.line1};
  position: relative;
`;

interface ILabelingVerbalArea {
  verbalList: ILabelingAll[];
}

const LabelingVerbalArea: React.FC<ILabelingVerbalArea> = ({ verbalList }) => {
  return (
    <LabelingVerbalAreaWrapper>
      {verbalList.map((verbal) => (
        <LabelingVerbalItem
          key={verbal.verbal_id}
          sectionId={verbal.verbal_id}
          startTime={verbal.start_time / 1000}
          endTime={verbal.end_time / 1000}
          sentence={verbal.sentence}
        />
      ))}
    </LabelingVerbalAreaWrapper>
  );
};

export default LabelingVerbalArea;
