import React from 'react';

import SVG, { type ISVG } from '..';

const Home: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16 " {...rest}>
      <path data-name="사각형 288" opacity=".25" fill="none" d="M0 0h16v16H0z" />
      <path
        data-name="패스 2083"
        d="M1 8.416 7.963 3l6.963 5.416v6.963a1.547 1.547 0 0 1-1.547 1.547H2.547A1.547 1.547 0 0 1 1 15.379z"
        transform="translate(.037 -1.963)"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2px"
        fill="none"
      />
      <path
        data-name="패스 2084"
        d="M7 16.334V11h4v5.334"
        transform="translate(-1 -1.798)"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2px"
        fill="none"
      />
    </SVG>
  );
};

export default Home;
