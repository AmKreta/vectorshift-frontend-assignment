import styled from "@emotion/styled";

const StyledSelect = styled.select``;

export function Select({ options, value, onChange }) {
  return (
    <StyledSelect value={value} onChange={onChange}>
      {!value && (
        <option value="" style={{ display: "none" }}>
          Select an option
        </option>
      )}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </StyledSelect>
  );
}
