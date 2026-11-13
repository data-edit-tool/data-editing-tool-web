import PlayArrow from 'components/SVG/Icon/PlayArrow';

const VerbalLabelingHeader = () => {
  return (
    <li>
      <div>
        <PlayArrow width="5" height="6" color="#c9c9c9" />
      </div>
      <div>No.</div>
      <div>Verbal_sentence</div>
      <div>Affective_state</div>
      <div>Channel</div>
      <div>Sentiment</div>
      <div>FC_Intent</div>
      <div>BC_Intent</div>
      <div>Emotion</div>
      <div>verbal_VAD</div>
      <div>overall_VAD</div>
      <div>Start_time</div>
      <div>End_time</div>
    </li>
  );
};

export default VerbalLabelingHeader;
