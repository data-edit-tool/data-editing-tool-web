import React from 'react';

import SVG, { type ISVG } from '..';

const Expand: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <defs>
        <clipPath id="nrxw8fxnva">
          <path data-name="사각형 40174" fill="none" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#nrxw8fxnva)">
        <path
          data-name="패스 14062"
          d="M3.751 9.991a.761.761 0 0 1-.761-.761V3.752a.761.761 0 0 1 .761-.761h5.478a.761.761 0 0 1 0 1.522H4.512V9.23a.761.761 0 0 1-.761.761"
          fill={color}
        />
        <path
          data-name="패스 14063"
          d="M20.249 9.991a.761.761 0 0 0 .761-.761V3.752a.761.761 0 0 0-.761-.761h-5.478a.761.761 0 0 0 0 1.522h4.717V9.23a.761.761 0 0 0 .761.761"
          fill={color}
        />
        <path
          data-name="패스 14064"
          d="M3.751 14.009a.761.761 0 0 0-.761.761v5.478a.761.761 0 0 0 .761.761h5.478a.761.761 0 0 0 0-1.522H4.512V14.77a.761.761 0 0 0-.761-.761"
          fill={color}
        />
        <path
          data-name="패스 14065"
          d="M20.249 14.009a.761.761 0 0 1 .761.761v5.478a.761.761 0 0 1-.761.761h-5.478a.761.761 0 0 1 0-1.522h4.717V14.77a.761.761 0 0 1 .761-.761"
          fill={color}
        />
      </g>
    </SVG>
  );
};

export default Expand;
