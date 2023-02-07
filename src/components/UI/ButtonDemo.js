import React from "react";

const Button = (props) => {
  const { content, disabled, onClick, customStyle, type } = props;
  return (
    <button
      type={type}
      className={`defaultStyle ${customStyle}`}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

<ButtonDemo
  className={styles.facebookButton}
  disabled={true}
  content={"Facebook"}
  onClick={() => {
    console.log("FAcebook clik handler");
  }}
/>;
