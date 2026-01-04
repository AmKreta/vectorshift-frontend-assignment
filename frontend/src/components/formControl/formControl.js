import styled from "@emotion/styled";
import { Text } from "../text/text";

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormControl = ({ label, children }) => {
  return (
    <StyledLabel>
      {label ? (
        <Text variant="label" as="label">
          {label}
        </Text>
      ) : null}
      {children}
    </StyledLabel>
  );
};
