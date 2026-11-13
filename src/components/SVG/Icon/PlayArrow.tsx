import React from 'react';

import SVG, { type ISVG } from '..';

const PlayArrow: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 6" {...rest}>
      <path data-name="point_boundingbox_6x5px" d="m3 0 3 5H0z" transform="rotate(90 2.5 2.5)" fill={color} />
    </SVG>
  );
};

export default PlayArrow;
