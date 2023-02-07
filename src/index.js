import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthContextProvider from './context/auth-context/auth-context';
import ModalContextProvider from './context/modal-context/modal-context';
import { BrowserRouter } from 'react-router-dom';
import DistributionContextProvider from './context/distribution-context/distribution-context';
import './index.css';
import SurveyContextProvider from './context/survey-context/survey-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ModalContextProvider>
          <DistributionContextProvider>
            <SurveyContextProvider>
              <App />
            </SurveyContextProvider>
          </DistributionContextProvider>
        </ModalContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
