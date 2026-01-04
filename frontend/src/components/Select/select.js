import styled from "@emotion/styled";
import { useState } from "react";

const StyledSelect = styled.div`
  max-width: 100%;
  width: 100%;
  padding: ${(props) => (props.showHeader ? "4px 8px" : "0")};
  border: ${(props) => (props.showHeader ? "1px solid #ccc" : "none")};
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: #f5f5f5;
  position: relative;
  height: ${(props) => (props.showHeader ? "auto" : "0")};
`;

const SelectHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SelectHeaderText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const SelectHeaderIcon = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

const SelectOptionContainer = styled.div`
  position: fixed;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledOptions = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: #f5f5f5;
  padding: 4px 8px;

  &:hover {
    background-color: rgb(209, 204, 204);
  }

  &:selected {
    background-color: rgb(209, 204, 204);
  }
`;

export function Select({
  options,
  value,
  onChange,
  open,
  setOpen,
  showHeader = true,
}) {
  const [isOpen, setIsOpen] = useState(false);

  open = typeof open !== "undefined" ? open : isOpen;
  setOpen = typeof setOpen !== "undefined" ? setOpen : setIsOpen;

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleOptionClick = (e) => {
    const index = e.target.dataset.index;
    const option = options[index];
    if (option) {
      onChange(option);
    }
    setOpen(false);
  };

  return (
    <StyledSelect value={value} onChange={onChange} showHeader={showHeader}>
      {showHeader && (
        <SelectHeader onClick={toggleOpen}>
          <SelectHeaderText>{value || "Select an option"}</SelectHeaderText>
          <SelectHeaderIcon>{open ? "^" : "v"}</SelectHeaderIcon>
        </SelectHeader>
      )}
      {open && (
        <SelectOptionContainer onClick={handleOptionClick}>
          {options.map((option, index) => (
            <StyledOptions key={option} value={option} data-index={index}>
              {option}
            </StyledOptions>
          ))}
        </SelectOptionContainer>
      )}
    </StyledSelect>
  );
}
