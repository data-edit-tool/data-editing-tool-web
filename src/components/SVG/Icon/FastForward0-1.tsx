import React from 'react';

import SVG, { type ISVG } from '..';

const FastForward01: React.FC<ISVG> = ({ color, ...rest }) => {
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
      </g>
      <g data-name="그룹 73081">
        <g data-name="그룹 2810">
          <path
            data-name="Shape"
            d="M294.554 192.635a.565.565 0 0 0 0 1.13h1.694a.565.565 0 0 0 0-1.13h-.282v-4.8a.565.565 0 0 0-.878-.47l-.847.565a.565.565 0 0 0 .6.96v3.749z"
            transform="translate(-278.869 -176.615)"
            fill={color}
          />
        </g>
        <g data-name="그룹 73072">
          <text
            data-name="0"
            transform="translate(9.057 18)"
            fontFamily='GangwonEduAllBold, "GangwonEduAll'
            letterSpacing="-.01em"
            fontSize="11px"
            fill={color}
          >
            <tspan x="-2.585" y="0">
              0
            </tspan>
          </text>
          <text
            data-name="."
            transform="translate(13.057 17)"
            fontSize="12px"
            fontFamily='GangwonEduAllBold, "GangwonEduAll'
            letterSpacing="-.01em"
            fill={color}
          >
            <tspan x="-1.848" y="0">
              .
            </tspan>
          </text>
        </g>
      </g>
    </SVG>
  );
};

export default FastForward01;
