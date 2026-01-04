import styled from "@emotion/styled";
import { forwardRef } from "react";

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

const _Input = function ({ value, onChange, ...rest }, ref) {
  return <StyledInput value={value} onChange={onChange} {...rest} ref={ref} />;
};

export const Input = forwardRef(_Input);
