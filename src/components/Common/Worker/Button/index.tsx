import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { styled } from 'styled-components';

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  variant?: 'primary' | 'secondary';
  size?: string;
}

const ButtonWrapper = styled.button`
  width: 100%;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.workerColor.primary};
  color: ${({ theme }) => theme.workerColor.white};
  padding: 11px 0px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.text_14};
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin: auto 12px auto 0;
  }
  &.s {
    padding: 3px 0px;
    border-radius: 4px;
    font-size: ${({ theme }) => theme.fontSize.text_12};
  }
  &:hover {
    background-color: #2a358b;
  }
  &:disabled {
    opacity: 0.5;
  }
  &.secondary {
    background-color: ${({ theme }) => theme.workerColor.secondary};
    &:hover {
      background-color: #1c212c;
    }
  }
`;

const Button = forwardRef<HTMLButtonElement, IButton>(({ type = 'button', variant, size, className, onClick, children, ...props }, ref) => {
  return (
    <ButtonWrapper
      type={type}
      className={classNames(className, {
        primary: variant === 'primary',
        secondary: variant === 'secondary',
        s: size === 's',
      })}
      onClick={onClick}
      ref={ref}
      {...props}
    >
      {children}
    </ButtonWrapper>
  );
});

Button.displayName = 'Button';

export default Button;
