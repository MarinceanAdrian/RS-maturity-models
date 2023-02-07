import React, { useContext, useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/auth-context/auth-context';
import UserDetailsContextProvider from './context/userDetails-context/userDetails-context';
import { Backdrop } from './components/UI/WrapperCard';
import Spinner from './components/UI/Spinner';
import { SurveyDisplay } from './pages/SurveyDisplay';

const Dashboard = React.lazy(() => import('./pages/Home/Dashboard'));
const LoginForm = React.lazy(() => import('./components/Login/LoginForm'));
const Header = React.lazy(() => import('./components/UI/Header/Header'));
const CreateSurvey = React.lazy(() => import('./pages/Home/CreateSurvey'));
const SurveyCreator = React.lazy(() => import('./components/DashboardComponents/SurveyCreator'));

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // we use this piece of state in order to hide the burger menu
  // if we are on the login page. If we are not on the login page, we show the burger menu
  const [isOnLoginPage, setIsOnLoginPage] = useState(false);

  const navigate = useNavigate();

  const { token } = useContext(AuthContext);

  const closeSidebarInMobileViewHandler = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const isSurveyRoute = window.location.href.indexOf('/survey/') > -1;
    if (!token && !isSurveyRoute) {
      navigate('/login');
    }
  }, [token]);

  return (
    <Suspense fallback={<Spinner generalSpinner={true} />}>
      <div className="App">
        {isSidebarOpen && <Backdrop onCloseSidebar={closeSidebarInMobileViewHandler} />}
        {/* If we want the Header to be present in every Component uncommented the below code.
          Otherwise, we added the Header Componenet just where we want it. */}
        {/* <UserDetailsContextProvider>
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isOnLoginPage={isOnLoginPage}
          />
        </UserDetailsContextProvider> */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <UserDetailsContextProvider>
                  <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isOnLoginPage={isOnLoginPage}
                  />
                </UserDetailsContextProvider>
                <Dashboard
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  setIsOnLoginPage={setIsOnLoginPage}
                />
              </>
            }
          />
          <Route
            path="/create-survey"
            element={
              <>
                <UserDetailsContextProvider>
                  <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isOnLoginPage={isOnLoginPage}
                  />
                </UserDetailsContextProvider>
                <CreateSurvey
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  setIsOnLoginPage={setIsOnLoginPage}
                />
              </>
            }
          />
          <Route path="/survey/:userId/:surveyId" element={<SurveyDisplay />} />
          <Route
            path="/survey-creator"
            element={
              <>
                <UserDetailsContextProvider>
                  <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isOnLoginPage={isOnLoginPage}
                  />
                </UserDetailsContextProvider>
                <SurveyCreator />
              </>
            }
          />
          <Route
            path="/survey-creator/:id"
            element={
              <>
                <UserDetailsContextProvider>
                  <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isOnLoginPage={isOnLoginPage}
                  />
                </UserDetailsContextProvider>
                <SurveyCreator />
              </>
            }
          />
          <Route path="/login" element={<LoginForm setIsOnLoginPage={setIsOnLoginPage} />} />
        </Routes>
      </div>
    </Suspense>
  );
};

export default App;
