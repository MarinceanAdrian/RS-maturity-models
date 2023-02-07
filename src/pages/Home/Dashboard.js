import React, { useContext, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context/auth-context";
import FoldersContextProvider from "../../context/folders-context/folders-context";
import classes from "./Dashboard.module.css";

const Sidebar = React.lazy(() =>
  import("../../components/DashboardComponents/Sidebar/Sidebar")
);
const Main = React.lazy(() =>
  import("../../components/DashboardComponents/Main/Main")
);
const Spinner = React.lazy(() => import("../../components/UI/Spinner"));

const Dashboard = ({ isSidebarOpen, setIsSidebarOpen, setIsOnLoginPage }) => {


  // updated the state in App.js in order to reveal the burger menu
  useEffect(() => {
    setIsOnLoginPage(false);
  }, []);


  return (
    <FoldersContextProvider>
      <div className={classes.dashboard}>
        <Suspense fallback={<Spinner generalSpinner={true} />}>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </Suspense>
        <Main />
      </div>
    </FoldersContextProvider>
  );
};

export default Dashboard;
