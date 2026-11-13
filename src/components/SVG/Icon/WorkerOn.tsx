import React from 'react';

import SVG, { type ISVG } from '..';

const WorkerOn: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 19" {...rest}>
      <path data-name="패스 4417" d="M0 0h20v20H0z" fill="transparent" />
      <path
        data-name="패스 4418"
        d="M11.222 5.313a.608.608 0 0 1 0 .86l-4.079 4.078a.608.608 0 0 1-.86 0L4.342 8.31a.608.608 0 1 1 .86-.86l1.512 1.512 3.649-3.649a.608.608 0 0 1 .859 0zm4.342 2.469a7.778 7.778 0 1 1-2.278-5.5 7.782 7.782 0 0 1 2.278 5.5zm-1.216 0a6.566 6.566 0 1 0-6.566 6.566 7.209 7.209 0 0 0 1.718-.226 6.477 6.477 0 0 0 4.848-6.34z"
        transform="translate(2 2)"
        fill={color}
      />
    </SVG>
  );
};

export default WorkerOn;
