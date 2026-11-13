import React from 'react';

import SVG, { type ISVG } from '..';

const ZoomIn: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...rest}>
      <path data-name="사각형 39626" fill="none" d="M0 0h20v20H0z" />
      <path
        d="m149.433 244.77-4.7-4.7a4.606 4.606 0 0 1-1.512.884 5.244 5.244 0 0 1-1.787.31 5.253 5.253 0 1 1 5.223-5.246 5.191 5.191 0 0 1-.312 1.777 5.1 5.1 0 0 1-.9 1.566l4.716 4.681zm-8.015-4.494a4.241 4.241 0 1 0-3.034-1.24 4.1 4.1 0 0 0 3.034 1.24zm-.506-2.063v-1.722h-1.722v-.986h1.722v-1.7h.986v1.7h1.7v.986h-1.7v1.722z"
        transform="translate(-133.155 -227.77)"
        fill={color}
      />
    </SVG>
  );
};

export default ZoomIn;
