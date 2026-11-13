import React from 'react';
import styled, { css } from 'styled-components';
import { layout, LayoutProps, space, SpaceProps } from 'styled-system';

// Divider 컴포넌트 스타일
const DividerStyled = styled.hr<SpaceProps & LayoutProps & { orientation?: 'vertical' | 'horizontal' }>`
  border: none;
  ${space}

  ${layout}
  height: 32px;
  background-color: transparent;

  ${(props) =>
    props.orientation === 'vertical' &&
    css`
      border-left: 1px solid;
      height: 100%;
    `}

  ${(props) =>
    props.orientation === 'horizontal' &&
    css`
      border-top: 1px solid;
      width: 100%;
    `}

    ${(props) =>
    props.color &&
    css`
      border-color: ${props.color};
    `}
`;

// Divider 컴포넌트 Props 타입 정의
interface DividerProps extends SpaceProps, LayoutProps {
  orientation?: 'vertical' | 'horizontal';
  color?: string;
}

// Divider 컴포넌트
const Divider: React.FC<DividerProps> = (props) => <DividerStyled {...props} />;

export default Divider;
