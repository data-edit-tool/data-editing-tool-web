import PlayArrow from 'components/SVG/Icon/PlayArrow';

const NonVerbalLabelingHeader = () => {
  return (
    <li>
      <div>
        <PlayArrow width="5" height="6" color="#c9c9c9" />
      </div>
      <div>No.</div>
      <div>G-subject</div>
      <div>G-action</div>
      <div>G-object</div>
      <div>Angle</div>
      <div>Affective_state</div>
      <div>Intent</div>
      <div>Function</div>
      <div>Emotion</div>
      <div>Start_time</div>
      <div>End_time</div>
    </li>
  );
};

export default NonVerbalLabelingHeader;
