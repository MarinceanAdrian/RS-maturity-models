import React, { useState } from "react";
import Button from "../../UI/Button";
import FolderStructure from "./FolderStructure";
import AddFolder from "./AddFolder";
import TemplateStrucutre from "./TemplateStrucutre";
import classes from "./Sidebar.module.css";
import logo from "../../../assets/photos/logo.png";

const Sidebar = ({ isSidebarOpen, createSurveyPage = false }) => {
  const [isCreatingNewFolder, setIsCreatingNewFolder] = useState(false);

  const createNewFolderHandler = (e) => {
    if (!isCreatingNewFolder) {
      setIsCreatingNewFolder(true);
    }

    // Can't explain why this isn't working..Why isCreating folder remains false?
    // I guess is something with setIsCreatingNewFolder updating the state async..
    if (isCreatingNewFolder === true && e.target.nodeName === "svg") {
      console.log("clicked");
    }
  };

  let sidebarClass = `${classes.sidebar} ${
    isSidebarOpen ? `${classes.open}` : ""
  }`;
  return (
    <aside className={sidebarClass}>
      <div>
        <span>
          <img src={logo} alt="logo" className={classes.logo}/>
        </span>
        <h2>Cercetare de piață</h2>
      </div>
      <AddFolder
        createSurveyPage={createSurveyPage}
        createNewFolderHandler={createNewFolderHandler}
      />

      {!createSurveyPage ? (
        <FolderStructure
          isCreatingNewFolder={isCreatingNewFolder}
          setIsCreatingNewFolder={setIsCreatingNewFolder}
        />
      ) : (
        <TemplateStrucutre />
      )}
      <Button>Îmbunătățește pachetul!</Button>
    </aside>
  );
};
export default Sidebar;