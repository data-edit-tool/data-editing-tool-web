import React, { ReactNode } from 'react';
import styled from 'styled-components';
import {
  background,
  BackgroundProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  zIndex,
  ZIndexProps,
} from 'styled-system';

type StackProps = {
  direction?: 'row' | 'column';
  spacing?: number;
  children: ReactNode;
} & SpaceProps &
  FlexboxProps &
  LayoutProps &
  BackgroundProps &
  ZIndexProps &
  PositionProps &
  React.ComponentPropsWithRef<'div'> & {
    onContextMenu?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
    style?: React.CSSProperties;
  };

const StackContainer = styled.div<StackProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'column'};
  gap: ${({ spacing }) => spacing}px;
  box-sizing: border-box;
  ${space}
  ${flexbox}
  ${layout}
  ${background}
  ${zIndex}
  ${position}
`;

// forward Ref를 사용해서 아래컴포넌트를 개선한다.
const Stack = React.forwardRef<HTMLDivElement, StackProps>(({ direction = 'column', spacing = 8, children, ...rest }, ref) => {
  return (
    <StackContainer ref={ref} direction={direction} spacing={spacing} {...rest}>
      {children}
    </StackContainer>
  );
});

Stack.displayName = 'Stack';

export default Stack;
