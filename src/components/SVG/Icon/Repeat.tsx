import React from 'react';

import SVG, { type ISVG } from '..';

const Repeat: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <g data-name="그룹 2811">
        <path
          data-name="패스 4330"
          d="M26.525 28.836a.746.746 0 0 0-.75.742v2.244a3.036 3.036 0 0 1-3.05 3.015H10.446v-1.112a.306.306 0 0 0-.475-.254l-2.82 1.845a.3.3 0 0 0 0 .5l2.806 1.866a.306.306 0 0 0 .477-.25v-1.114h12.292a4.53 4.53 0 0 0 4.549-4.5v-2.24a.746.746 0 0 0-.75-.742z"
          transform="translate(-4.643 -18.738)"
          fill={color}
        />
        <path
          data-name="패스 4331"
          d="M7.5 23.21v-2.293a3.036 3.036 0 0 1 3.049-3.017h12.285v1.114a.306.306 0 0 0 .476.25l2.811-1.864a.3.3 0 0 0 0-.5L23.3 15.051a.306.306 0 0 0-.475.253v1.112H10.549A4.53 4.53 0 0 0 6 20.917v2.293a.75.75 0 0 0 1.5 0z"
          transform="translate(-4 -10)"
          fill={color}
        />
      </g>
      <path data-name="사각형 2449" fill="none" d="M0 0h24v24H0z" />
    </SVG>
  );
};

export default Repeat;
