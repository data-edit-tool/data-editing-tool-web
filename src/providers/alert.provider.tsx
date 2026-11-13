/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

import Alert from 'components/Modal/WorkerAlert';

interface Alert {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isCancel?: boolean;
  leftBtnText?: string;
  rightBtnText: string;
  confirmDisabled?: boolean;
}

interface AlertProviderProps {
  alert: Alert;
  handleShowAlert: (alert: Alert) => void;
  handleCloseAlert: () => void;
}

const AlertContext = createContext<AlertProviderProps | undefined>(undefined);

const getInitialAlertState = (): Alert => ({
  open: false,
  title: '',
  content: '',
  onConfirm: () => {},
  onCancel: () => {},
  isCancel: false,
  leftBtnText: '취소',
  rightBtnText: '확인',
  confirmDisabled: false,
});

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

const AlertProvider = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();
  const [alert, setAlert] = useState<Alert>(() => getInitialAlertState());

  useEffect(() => {
    setAlert((prev) => {
      prev.onCancel?.();
      return getInitialAlertState();
    });
  }, [location.pathname, location.search]);

  const handleShowAlert = (alert: Alert) => {
    setAlert(alert);
  };

  const handleCloseAlert = () => {
    setAlert(getInitialAlertState());
  };

  return (
    <AlertContext.Provider value={{ alert, handleShowAlert, handleCloseAlert }}>
      {children}
      {alert.open && (
        <Alert
          title={alert.title}
          content={alert.content}
          rightBtnText={alert.rightBtnText}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
          isCancel={alert.isCancel}
          confirmDisabled={alert.confirmDisabled}
          leftBtnText={alert.leftBtnText}
        />
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
