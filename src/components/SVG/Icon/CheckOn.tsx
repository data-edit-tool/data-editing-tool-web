import React from 'react';

import SVG, { type ISVG } from '..';

const CheckOn: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...rest}>
      <g data-name="그룹 2736">
        <path
          data-name="패스 3060"
          d="M12.537 2.525a.544.544 0 0 0-.769 0L5.374 8.918 2.08 5.6a.542.542 0 0 0-.768 0L.158 6.756a.546.546 0 0 0 0 .769l4.828 4.859a.547.547 0 0 0 .769 0l7.935-7.936a.544.544 0 0 0 0-.772z"
          transform="translate(3.074 3.546)"
          fill={color}
        />
      </g>
    </SVG>
  );
};

export default CheckOn;
