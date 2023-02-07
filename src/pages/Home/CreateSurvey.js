import React, { Suspense } from "react";
import FoldersContextProvider from "../../context/folders-context/folders-context";
import TemplateContextProvider from "../../context/templates-context/templates-context";
import classes from "./CreateSurvey.module.css";
import BackButton from "../../components/UI/BackButton";

const Sidebar = React.lazy(() =>
  import("../../components/DashboardComponents/Sidebar/Sidebar")
);
const Main = React.lazy(() =>
  import("../../components/DashboardComponents/Main/Main")
);
const Spinner = React.lazy(() => import("../../components/UI/Spinner"));

const CreateSurvey = ({ isSidebarOpen, setIsSidebarOpen }) => {

  return (
    <FoldersContextProvider>
      <TemplateContextProvider>
        <BackButton />
        <div className={classes["create-survey"]}>
          <Suspense fallback={<Spinner generalSpinner={true} />}>
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              createSurveyPage={true}
            />
            <Main createSurveyPage={true} />
          </Suspense>
        </div>
      </TemplateContextProvider>
    </FoldersContextProvider>
  );
};

export default CreateSurvey;
