import React from 'react';

import SVG, { type ISVG } from '..';

const FastForward1: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <path data-name="사각형 2447" fill="none" d="M0 0h24v24H0z" />
      <g data-name="118---Forward">
        <path
          d="M27.8 7.344a.793.793 0 0 0-1.244.983 8.627 8.627 0 0 1 1.875 5.4 8.718 8.718 0 1 1-9.745-8.655l-1.074.921a.793.793 0 0 0 1.03 1.2l2.771-2.373a.792.792 0 0 0 0-1.2l-2.774-2.381a.793.793 0 1 0-1.03 1.2l1.2 1.025a10.3 10.3 0 1 0 11.203 10.265A10.2 10.2 0 0 0 27.8 7.344z"
          transform="translate(-7.406 -.035)"
          fill={color}
        />
        <path
          data-name="Shape"
          d="M300.6 7.094a.792.792 0 0 0 1.118.086l2.775-2.38a.792.792 0 0 0 0-1.2l-2.774-2.378a.793.793 0 1 0-1.03 1.2l2.07 1.778-2.071 1.776a.793.793 0 0 0-.087 1.117z"
          transform="translate(-285.333 -.017)"
          fill={color}
        />
        <g data-name="그룹 2810">
          <path
            data-name="Shape"
            d="M294.7 194a.709.709 0 0 0 0 1.417h2.124a.709.709 0 0 0 0-1.417h-.354v-6.024a.708.708 0 0 0-1.1-.59l-1.062.709a.709.709 0 0 0 .747 1.2V194z"
            transform="translate(-282.989 -177.266)"
            fill={color}
          />
        </g>
      </g>
    </SVG>
  );
};

export default FastForward1;
