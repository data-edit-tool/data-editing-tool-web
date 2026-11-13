import React from 'react';

import SVG, { type ISVG } from '..';

const Play: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <path data-name="사각형 2438" fill="none" d="M0 0h24v24H0z" />
      <path
        data-name="패스 4323"
        d="M31.849 8.272 17.35.116A.906.906 0 0 0 16 .907v16.311a.907.907 0 0 0 1.35.79l14.5-8.156a.907.907 0 0 0 0-1.58z"
        transform="translate(-10 3)"
        fill={color}
      />
    </SVG>
  );
};

export default Play;
