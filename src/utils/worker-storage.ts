export const getSaveWorker = () => {
  const saveWorker = window.localStorage.getItem('worker');
  if (saveWorker) {
    return JSON.parse(saveWorker);
  }
  return null;
};

export const removeWorker = () => {
  window.localStorage.removeItem('worker');
};
