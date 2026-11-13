import styled from 'styled-components';
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flex,
  flexbox,
  FlexboxProps,
  gridGap,
  GridGapProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system';

type BoxProps = SpaceProps & LayoutProps & ColorProps & FlexboxProps & BorderProps & PositionProps & ShadowProps & TypographyProps & GridGapProps;

const Box = styled.div<BoxProps>`
  ${space}
  ${layout}
  ${color}
  ${flexbox}
  ${border}
  ${position}
  ${shadow}
  ${typography}
  ${gridGap}
  ${flex}
`;

export default Box;
