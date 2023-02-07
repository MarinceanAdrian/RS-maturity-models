import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";

const InputEl = styled.input`
  padding: 0.5rem;
  border: 0.05rem solid #eaeaea;
  outline: none;
  color: var(--grayText);
  transition: var(--transition);
`;

const Input = forwardRef(({
  type,
  id,
  value,
  changeHandler,
  title = null,
  placeholder,
  onBlur,
  name
}, ref) => {
  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return {
      focus: activate,
    };
  });
  return (
    <InputEl
      ref={inputRef}
      type={type}
      id={id}
      value={value}
      onChange={changeHandler}
      placeholder={placeholder}
      onBlur={onBlur}
      name={name}
      title={title}
    />
  );
});

export default Input;
