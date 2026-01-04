import styled from "@emotion/styled";
import { forwardRef } from "react";
import { Text } from "../text/text";

const StyledButton = styled.button`
  padding: 12px 20px;
  background-color: #1c2536;
  border-radius: 8px;

  &:hover {
    background-color: #2c384e;
    cursor: pointer;
  }

  &:active {
    transform: translate(1px, 1px);
  }
`;

export function _Button({ children, ...rest }, ref) {
  return (
    <StyledButton ref={ref} {...rest}>
      {typeof children === "string" ? (
        <Text variant="medium" color="rgb(236, 235, 235)">
          {children}
        </Text>
      ) : (
        children
      )}
    </StyledButton>
  );
}

export const Button = forwardRef(_Button);
