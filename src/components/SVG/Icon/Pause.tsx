import React from 'react';

import SVG, { type ISVG } from '..';

const Pause: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <path data-name="사각형 2438" fill="none" d="M0 0h24v24H0z" />
      <path data-name="사각형 40118" transform="translate(6 3)" fill={color} d="M0 0h3v18.12H0z" />
      <path data-name="사각형 40119" transform="translate(15 3)" fill={color} d="M0 0h3v18.12H0z" />
    </SVG>
  );
};

export default Pause;
