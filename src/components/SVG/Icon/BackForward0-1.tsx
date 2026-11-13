import React from 'react';

import SVG, { type ISVG } from '..';

const BackForward01: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...rest}>
      <path data-name="사각형 2448" fill="none" d="M0 0h24v24H0z" />
      <g data-name="그룹 2807">
        <g data-name="119---Rewind">
          <path
            d="m1333.728-249.124 1.2-1.026a.794.794 0 0 0 .072-1.105.792.792 0 0 0-1.1-.1l-2.774 2.38a.793.793 0 0 0-.277.6.793.793 0 0 0 .277.6l2.774 2.38a.792.792 0 0 0 .788.161.793.793 0 0 0 .523-.612.794.794 0 0 0-.281-.755l-1.074-.922a8.726 8.726 0 0 1 7.666 9.354 8.723 8.723 0 0 1-9.037 8.035 8.724 8.724 0 0 1-8.375-8.724 8.643 8.643 0 0 1 1.875-5.408.794.794 0 0 0 .122-.79.793.793 0 0 0-.626-.5.792.792 0 0 0-.74.3 10.216 10.216 0 0 0-2.217 6.392 10.31 10.31 0 0 0 10 10.313 10.309 10.309 0 0 0 10.591-9.706 10.312 10.312 0 0 0-9.382-10.88z"
            transform="translate(-1320.519 251.533)"
            fill={color}
          />
          <path
            data-name="Shape"
            d="M1396.21-245.379a.8.8 0 0 0 .79.161.8.8 0 0 0 .524-.613.8.8 0 0 0-.281-.756l-2.077-1.781 2.077-1.781a.8.8 0 0 0 .072-1.107.8.8 0 0 0-1.1-.1l-2.782 2.385a.8.8 0 0 0-.278.6.8.8 0 0 0 .278.6z"
            transform="translate(-1387.981 251.533)"
            fill={color}
          />
        </g>
        <g data-name="그룹 73074">
          <g data-name="그룹 2810">
            <path
              data-name="Shape"
              d="M294.554 192.635a.565.565 0 0 0 0 1.13h1.694a.565.565 0 0 0 0-1.13h-.282v-4.8a.565.565 0 0 0-.878-.47l-.847.565a.565.565 0 0 0 .6.96v3.749z"
              transform="translate(-278.564 -177.615)"
              fill={color}
            />
          </g>
          <g data-name="그룹 73072">
            <text
              data-name="0"
              transform="translate(9.362 17)"
              fontFamily="GangwonEduAllBold, GangwonEduAll"
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
              transform="translate(13.362 16)"
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
      </g>
    </SVG>
  );
};

export default BackForward01;
