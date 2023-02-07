import React from "react";
import classes from "./AddFolder.module.css";
import { MdAddBox } from "react-icons/md";

const AddFolder = ({ createSurveyPage = false, createNewFolderHandler }) => {
  return (
    <div className={classes["sidebar__new-folder"]}>
      {!createSurveyPage && (
        <>
          <span>Folder</span>
          <span>
            <MdAddBox
              className={classes["sidebar__new-folder--icon"]}
              onClick={(e) => createNewFolderHandler(e)}
            />
          </span>
        </>
      )}
    </div>
  );
};

export default AddFolder;