import styled from "@emotion/styled";

const StyledSelect = styled.select`
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

const StyledOptions = styled.option`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: #f5f5f5;

  &:hover {
    background-color: rgb(209, 204, 204);
  }

  &:selected {
    background-color: rgb(209, 204, 204);
  }
`;

export function Select({ options, value, onChange }) {
  return (
    <StyledSelect value={value} onChange={onChange}>
      {!value && (
        <StyledOptions value="" style={{ display: "none" }}>
          Select an option
        </StyledOptions>
      )}
      {options.map((option) => (
        <StyledOptions key={option} value={option}>
          {option}
        </StyledOptions>
      ))}
    </StyledSelect>
  );
}
