import styled from "@emotion/styled";
import { forwardRef, useLayoutEffect, useRef } from "react";

const StyledInput = styled.input`
  max-width: 100%;
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: #f5f5f5;
`;

const StyledTextArea = styled.textarea`
  max-width: 100%;
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: #f5f5f5;
  resize: none;
  overflow: hidden;
`;

const _Input = function ({ value, onChange, dynamicHeight, ...rest }, ref) {
  const textAreaRef = useRef(null);

  if (dynamicHeight && ref) {
    ref.current = textAreaRef.current;
  }

  useLayoutEffect(() => {
    if (!dynamicHeight) return;
    const ta = textAreaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, [value]);

  if (dynamicHeight) {
    return (
      <StyledTextArea
        value={value}
        onChange={onChange}
        {...rest}
        ref={textAreaRef}
      />
    );
  }

  return <StyledInput value={value} onChange={onChange} {...rest} ref={ref} />;
};

export const Input = forwardRef(_Input);
