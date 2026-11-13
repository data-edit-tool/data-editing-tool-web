import React from 'react';
import { useAxiosInterceptor } from 'hooks/useAxiosInterceptor';

import Routes from './routes';

import 'styles/styles.css';

const App: React.FC = () => {
  useAxiosInterceptor();
  return (
    <>
      <Routes />
    </>
  );
};

export default App;
