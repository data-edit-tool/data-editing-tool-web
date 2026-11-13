import React from 'react';

import SVG, { type ISVG } from '..';

const ArrowReturn: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...rest}>
      <path data-name="사각형 2335" fill="none" d="M0 0h20v20H0z" />
      <path
        data-name="패스 3059"
        d="M31.4 95h-6.586a.334.334 0 0 0-.314.351v2.8a.334.334 0 0 0 .314.351H31.4a2.117 2.117 0 0 1 0 4.207h-1.88v-1.749a.353.353 0 0 0-.194-.324.293.293 0 0 0-.342.076l-3.138 3.506a.381.381 0 0 0 0 .5l3.138 3.506a.3.3 0 0 0 .222.1.29.29 0 0 0 .12-.027.353.353 0 0 0 .194-.324v-1.753h1.88c2.768 0 5.02-2.517 5.02-5.61S34.171 95 31.4 95z"
        transform="translate(-20.827 -89.365)"
        fill={color}
      />
    </SVG>
  );
};

export default ArrowReturn;
