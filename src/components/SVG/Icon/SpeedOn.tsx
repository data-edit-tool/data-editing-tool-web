import React from 'react';

import SVG, { type ISVG } from '..';

const SpeedOn: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <path data-name="사각형 2460" fill="none" d="M0 0h24v24H0z" />
      <g data-name="그룹 2812">
        <path
          data-name="패스 4333"
          d="m7.565 345.811-.647-.679a.457.457 0 0 1-.015-.611 7.31 7.31 0 0 0 1.7-6.288 7.2 7.2 0 0 0-2.862-4.577 7.448 7.448 0 0 0-10.1 10.83.453.453 0 0 1-.03.616l-.669.66a.453.453 0 0 1-.639 0 9.268 9.268 0 0 1-1.973-8.757 9.381 9.381 0 0 1 8.567-6.7 9.324 9.324 0 0 1 9.208 6.281 9.241 9.241 0 0 1-1.888 9.228.455.455 0 0 1-.652-.003z"
          fill={color}
          transform="translate(11.027 -326.303)"
        />
        <path
          data-name="패스 4334"
          d="m86.949 389.374.523.551a.345.345 0 0 1 .01.465l-4.075 4.661a.345.345 0 0 1-.5.016l-1.119-1.125a.345.345 0 0 1 .017-.5l4.67-4.087a.346.346 0 0 1 .474.019z"
          transform="translate(-71.018 -380.23)"
          fill={color}
        />
      </g>
    </SVG>
  );
};

export default SpeedOn;
