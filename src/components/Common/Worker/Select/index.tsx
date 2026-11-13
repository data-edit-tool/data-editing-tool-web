import React, { useState } from 'react';
import classNames from 'classnames';
import useClickAway from 'hooks/useClickAway';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IOption } from 'types/interface';

import Arrow from 'components/SVG/Icon/Arrow';

const Container = styled.div`
  position: relative;
  z-index: 3;
  .select {
    display: flex;
    padding: 0px 40px 0px 10px;
    justify-content: space-between;
    align-items: center;
    height: 42px;
    position: relative;
    border: 1px solid ${({ theme }) => theme.workerColor.boxBorder};
    font-size: ${({ theme }) => theme.fontSize.text_12};
    color: ${({ theme }) => theme.workerColor.txt2};
    border-radius: 6px;
    background-color: ${({ theme }) => theme.workerColor.line1};
    line-height: 18px;
    cursor: pointer;
    &.s {
      height: 20px;
      padding: 1px 28px 1px 8px;
      svg {
        right: 8px;
      }
    }
    svg {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
    span {
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-word;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    &.open {
      border: 1px solid #75869b;
      border-top-right-radius: 6px;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      svg {
        transform: rotate(180deg) translateY(50%);
      }
    }
    &.placeholder {
      color: #949ca5 !important;
    }
  }
  ul {
    &.s {
      top: 20px;
      li {
        padding: 1px 0px 1px 8px;
        height: 20px;
      }
    }
    background-color: ${({ theme }) => theme.workerColor.line1};
    position: absolute;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    border: 1px solid ${({ theme }) => theme.workerColor.boxBorder};
    width: 100%;
    top: 42px;
    left: 0;
    z-index: 1;
    li {
      padding: 0px 40px 0px 10px;
      height: 42px;
      cursor: pointer;
      font-size: ${({ theme }) => theme.fontSize.text_12};
      color: ${({ theme }) => theme.workerColor.txt2};
      display: flex;
      align-items: center;
      span {
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      &:hover {
        background-color: ${({ theme }) => theme.adminColor.primary};
        color: ${({ theme }) => theme.adminColor.white};
      }
    }
  }
`;

interface ISelect {
  className?: string;
  list: IOption[];
  selectOption: IOption | null;
  onClick?: (item: IOption) => void;
  placeholderText?: string;
  size?: 's';
}

const Select: React.FC<ISelect> = ({ className, list, selectOption, onClick, placeholderText, size }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref: React.RefObject<HTMLDivElement> = useClickAway(() => {
    setIsOpen(false);
  });

  const handleOpen = () => {
    if (list.length) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleOptionClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, selectItem: IOption) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onClick) {
      onClick(selectItem);
    }
  };

  return (
    <Container className={className} ref={ref}>
      <div onClick={handleOpen} className={classNames('select', { open: isOpen, placeholder: !selectOption, s: size === 's' })}>
        <span>{selectOption ? selectOption.name : placeholderText}</span>
        <Arrow width="16" height="16" color={theme.workerColor.line2} />
      </div>
      {isOpen && (
        <ul className={classNames({ s: size === 's' })}>
          {list.map((item) => (
            <li key={`select-item-${item.value}`} onClick={(e) => handleOptionClick(e, item)}>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default Select;
