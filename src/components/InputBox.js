import React from "react";
import TextField from "@mui/material/TextField";

const InputBox = ({ label, variant, className, type, textChange, name }) => {
  return (
    <TextField
      name={name}
      onChange={textChange}
      type={type}
      className={className}
      label={label}
      variant={variant}
    />
  );
};

export default InputBox;
