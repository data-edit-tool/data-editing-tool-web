import React from 'react';

import SVG, { type ISVG } from '..';

const AlertSuccess: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <g style={{ stroke: color, strokeWidth: '2px', fill: 'none' }}>
        <circle cx="12" cy="12" r="12" stroke="none" />
        <circle cx="12" cy="12" r="11" fill="none" />
      </g>
      <path
        data-name="패스 3060"
        d="M10.714 2.5a.465.465 0 0 0-.657 0L4.592 7.966 1.778 5.132a.463.463 0 0 0-.656 0l-.986.985a.466.466 0 0 0 0 .657l4.126 4.153a.467.467 0 0 0 .657 0L11.7 4.145a.465.465 0 0 0 0-.66z"
        transform="translate(6.081 5.285)"
        fill={color}
      />
    </SVG>
  );
};

export default AlertSuccess;
