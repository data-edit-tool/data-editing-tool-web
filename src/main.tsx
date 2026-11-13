import ReactDOM from 'react-dom/client';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { theme } from 'styles/theme';
import history from 'utils/history';

import AlertSuccess from 'components/SVG/Icon/AlertSuccess';

import ScrollTop from './components/Common/ScrollTop';
import { GlobalStyle } from './styles/global-styles';
import App from './App';

import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    {/* <React.StrictMode> */}
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        icon={() => <AlertSuccess color="#33a87b" width="24" height="24" />}
        limit={1}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeButton={false}
      />
      <Router history={history as any}>
        <ScrollTop />
        <RecoilRoot>
          <App />
          <div id="modal" />
        </RecoilRoot>
      </Router>
    </ThemeProvider>
    {/* </React.StrictMode> */}
  </>,
);
