import React from 'react';

import SVG, { type ISVG } from '..';

const WorkerClose: React.FC<ISVG> = ({ color, ...rest }) => {
  return (
    <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 19" {...rest}>
      <path data-name="패스 4419" d="M0 0h20v20H0z" fill="none" />
      <path
        data-name="합치기 28"
        d="m18246.063 7789.932-2-2-2 2a.621.621 0 0 1-.449.192.577.577 0 0 1-.15-.019.62.62 0 0 1-.443-.444.6.6 0 0 1 .178-.6l2-2-2-2a.613.613 0 0 1 .266-1.044.567.567 0 0 1 .146-.018.609.609 0 0 1 .453.2l2 2 2-2.006a.617.617 0 0 1 .436-.178.6.6 0 0 1 .432.178.61.61 0 0 1 0 .866l-2.006 2.006 2 2a.6.6 0 0 1 .18.6.624.624 0 0 1-.449.444.52.52 0 0 1-.146.019.621.621 0 0 1-.448-.196z"
        transform="translate(-18234.061 -7777.063)"
        fill={color}
      />
      <path
        data-name="패스 4421"
        d="M15.564 7.782a7.778 7.778 0 1 1-2.278-5.5 7.782 7.782 0 0 1 2.278 5.5zm-1.216 0a6.566 6.566 0 1 0-6.566 6.566 7.209 7.209 0 0 0 1.718-.226 6.477 6.477 0 0 0 4.848-6.34z"
        transform="translate(2 2)"
        fill={color}
      />
    </SVG>
  );
};

export default WorkerClose;
