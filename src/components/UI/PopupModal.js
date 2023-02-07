import React, { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { DistributionContext } from "../../context/distribution-context/distribution-context";
import classes from "./PopupModal.module.css";

const PopupModal = ({children}) => {
  const { isPublic } = useContext(DistributionContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isPublic === true) {
      setShow(true);
      const timeout = setTimeout(() => {
        setShow(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isPublic]);

  return (
    <>
      {createPortal(
        <aside
          className={`${classes["popup-modal"]} ${
            show ? `${classes.show}` : ""
          }`}
        >
          {/* Chestionar marcat ca public! */}
          {children}
        </aside>,
        document.getElementById("root")
      )}
    </>
  );
};

export default PopupModal;
