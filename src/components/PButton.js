import React from "react";

const PButton = (props) => {
  return (
    <props.bname
      className={props.className}
      onClick={props.click}
      variant="contained"
      disableRipple
    >
      {props.title}
    </props.bname>
  );
};

export default PButton;
