import React from 'react';

import SVG, { type ISVG } from '..';

const Contract: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" {...rest}>
      <defs>
        <clipPath id="3df2dbp0fa">
          <path data-name="사각형 40175" transform="translate(-.188 -.36)" fill="none" d="M0 0h38v38H0z" />
        </clipPath>
      </defs>
      <g data-name="그룹 74901" transform="translate(.188 .36)" clipPath="url(#3df2dbp0fa)">
        <path
          data-name="패스 14066"
          d="M12.826 2.991a1.2 1.2 0 0 1 1.2 1.2v8.636a1.2 1.2 0 0 1-1.2 1.2H4.19a1.2 1.2 0 0 1 0-2.4h7.436V4.191a1.2 1.2 0 0 1 1.2-1.2"
          transform="translate(1.724 1.724)"
          fill={color}
        />
        <path
          data-name="패스 14067"
          d="M15.21 2.991a1.2 1.2 0 0 0-1.2 1.2v8.636a1.2 1.2 0 0 0 1.2 1.2h8.636a1.2 1.2 0 1 0 0-2.4h-7.437V4.191a1.2 1.2 0 0 0-1.2-1.2"
          transform="translate(8.077 1.724)"
          fill={color}
        />
        <path
          data-name="패스 14068"
          d="M12.826 25.044a1.2 1.2 0 0 0 1.2-1.2v-8.635a1.2 1.2 0 0 0-1.2-1.2H4.19a1.2 1.2 0 0 0 0 2.4h7.436v7.436a1.2 1.2 0 0 0 1.2 1.2"
          transform="translate(1.724 8.076)"
          fill={color}
        />
        <path
          data-name="패스 14069"
          d="M15.21 25.044a1.2 1.2 0 0 1-1.2-1.2v-8.635a1.2 1.2 0 0 1 1.2-1.2h8.636a1.2 1.2 0 0 1 0 2.4h-7.437v7.436a1.2 1.2 0 0 1-1.2 1.2"
          transform="translate(8.077 8.076)"
          fill={color}
        />
      </g>
    </SVG>
  );
};

export default Contract;
