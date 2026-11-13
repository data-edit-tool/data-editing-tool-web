import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

const WorkerInputWrapper = styled.input`
  background-color: ${({ theme }) => theme.workerColor.white};
  border-radius: 4px;
  color: ${({ theme }) => theme.workerColor.black};
  font-size: ${({ theme }) => theme.fontSize.text_12};
  width: 100px;
  padding: 2px 10px;
`;

interface IWorkerInput extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, value: string) => void;
  onInputBlur: () => void;
}

const WorkerInput: React.FC<IWorkerInput> = ({ value, onInputKeyDown, onInputBlur, ...props }) => {
  const inputRef = useRef<HTMLInputElement>();
  const { register, getValues } = useForm({
    defaultValues: {
      sentence: value,
    },
  });

  const { ref, onBlur, ...rest } = register('sentence');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <WorkerInputWrapper
      type="text"
      onKeyDown={(e) => onInputKeyDown(e, getValues('sentence'))}
      onBlur={(e) => {
        onBlur(e);
        onInputBlur();
      }}
      {...rest}
      ref={(e) => {
        ref(e);
        if (e) {
          inputRef.current = e;
        }
      }}
      {...props}
    />
  );
};

export default WorkerInput;
