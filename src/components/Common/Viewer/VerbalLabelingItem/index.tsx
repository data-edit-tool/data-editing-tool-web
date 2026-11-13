import React, { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import {
  viewerLabelingAffectiveSelector,
  viewerLabelingBcIntentSelector,
  viewerLabelingChannelSelector,
  viewerLabelingEmotionSelector,
  viewerLabelingFcIntentSelector,
  viewerLabelingSentimentSelector,
} from 'state/viwer-labeling-category-list';
import { styled } from 'styled-components';
import { theme } from 'styles/theme';
import { ILabelingAll } from 'types/worker-interface';
import { formatTime } from 'utils/time-format';

import PlayArrow from 'components/SVG/Icon/PlayArrow';

import Button from '../../Worker/Button';
import LabelingSelect from '../../Worker/LabelingSelect';

const ViewerVerbalLabelingItemWrapper = styled.li<{ active: string; error: string }>`
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

interface IViewerVerbalLabelingItem {
  index: number;
  labeling: ILabelingAll;
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
  workerType: string;
  viewerType: boolean;
  onHeightChange: (labelingId: string, height: number) => void;
}

const ViewerVerbalLabelingItem: React.FC<IViewerVerbalLabelingItem> = ({
  index,
  labeling,
  onModalClick,
  onClick,
  active,
  process,
  onScroll,
  error,
  workerType,
  viewerType,
  onHeightChange,
}) => {
  const affectiveList = useRecoilValue(viewerLabelingAffectiveSelector);
  const channelList = useRecoilValue(viewerLabelingChannelSelector);
  const sentimentList = useRecoilValue(viewerLabelingSentimentSelector);
  const bcIntentList = useRecoilValue(viewerLabelingBcIntentSelector);
  const fcIntentList = useRecoilValue(viewerLabelingFcIntentSelector);
  const emotionList = useRecoilValue(viewerLabelingEmotionSelector);

  const verbalLabelingRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    const el = verbalLabelingRef.current;
    if (!el) {
      return;
    }
    const updateHeight = () => {
      onHeightChange(labeling.verbal_id, el.getBoundingClientRect().height);
    };
    updateHeight();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, [labeling.verbal_id, labeling.sentence, onHeightChange]);

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

  // 재생중 상태와 수정중인 상태일때 아이콘 표시
  const onProcessAndEdit = useCallback(() => {
    if (process) {
      return <PlayArrow width="5" height="6" color={theme.workerColor.timeline} />;
    }
    return null;
  }, [process]);

  return (
    <ViewerVerbalLabelingItemWrapper
      onClick={(e: React.MouseEvent<HTMLLIElement>) => onClick(e.ctrlKey || e.metaKey, labeling.verbal_id, labeling.start_time, labeling.end_time)}
      active={active}
      ref={verbalLabelingRef}
      error={error}
      id={labeling.verbal_id}
    >
      <div>{onProcessAndEdit()}</div>
      <div>{index + 1}.</div>
      <div>{labeling.sentence}</div>
      <div>
        <LabelingSelect
          id={`affective-${index}`}
          defaultOption
          width="102px"
          list={affectiveList}
          value={labeling.affective_state}
          handleChange={() => {
            return;
          }}
          eventBlock
          handleClick={() => {
            return;
          }}
          arrowNone
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
          handleChange={() => {
            return;
          }}
          eventBlock
          handleClick={() => {
            return;
          }}
          arrowNone
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
          handleChange={() => {
            return;
          }}
          eventBlock
          handleClick={() => {
            return;
          }}
          arrowNone
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
          handleChange={() => {
            return;
          }}
          eventBlock
          handleClick={() => {
            return;
          }}
          arrowNone
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
          handleChange={() => {
            return;
          }}
          eventBlock
          handleClick={() => {
            return;
          }}
          arrowNone
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
          handleChange={() => {
            return;
          }}
          eventBlock
          handleClick={() => {
            return;
          }}
          arrowNone
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
    </ViewerVerbalLabelingItemWrapper>
  );
};

function propsAreEqual(prevProps: IViewerVerbalLabelingItem, nextProps: IViewerVerbalLabelingItem) {
  return (
    prevProps.index === nextProps.index &&
    JSON.stringify(prevProps.labeling) === JSON.stringify(nextProps.labeling) &&
    prevProps.active === nextProps.active &&
    prevProps.process === nextProps.process &&
    prevProps.error === nextProps.error &&
    prevProps.workerType === nextProps.workerType &&
    prevProps.viewerType === nextProps.viewerType
  );
}

const ViewerVerbalLabelingItemMemo = memo(ViewerVerbalLabelingItem, propsAreEqual);

export default ViewerVerbalLabelingItemMemo;
