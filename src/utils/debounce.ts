let timerId: ReturnType<typeof setTimeout> | null = null;

// 디바운스 함수 정의
export const debounce = <F extends (...args: any[]) => void>(func: F, delay: number): F & { cancel: () => void } => {
  const debouncedFunction = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as F & { cancel: () => void };

  debouncedFunction.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debouncedFunction;
};
