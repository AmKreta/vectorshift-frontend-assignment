import { useEffect, useState } from "react";
import { Select } from "../Select/select";

export const ExpressionInput = ({
  value,
  onChange,
  options,
  selectedExpressions, // {value, startIndex, endIndex}
  selectedExpressionsChange,
  ...props
}) => {
  const [selectedExpressionIndex, setSelectedExpressionIndex] = useState(null);
  const [showExpressionSelect, setShowExpressionSelect] = useState(false);
  const [selecteExpressionValue, setSelecteExpressionValue] = useState("");

  useEffect(() => {
    setShowExpressionSelect(value.endsWith("{{"));
  }, [value]);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleExpressionSelect = (e) => {
    const val = e.target.value;
    const newText = value + val + "}}";

    selectedExpressionsChange([
      ...selectedExpressions,
      {
        value: val,
        startIndex: value.length,
        endIndex: value.length + val.length,
      },
    ]);
    onChange(newText);
  };

  const handleInputClick = (e) => {
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
    const currSelectedExpressionIndex = selectedExpressions.findIndex(
      (expression) =>
        selectionStart >= expression.startIndex &&
        selectionEnd <= expression.endIndex
    );
    if (currSelectedExpressionIndex > -1) {
      setSelectedExpressionIndex(currSelectedExpressionIndex);
      setSelecteExpressionValue(
        selectedExpressions[currSelectedExpressionIndex].value
      );
      setShowExpressionSelect(true);
    } else {
      setShowExpressionSelect(false);
      setSelecteExpressionValue("");
      setSelectedExpressionIndex(null);
    }
  };

  const handleBlur = () => {
    if (selectedExpressionIndex > -1) {
    }
    setSelectedExpressionIndex(null);
    setShowExpressionSelect(false);
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onClick={handleInputClick}
        // onBlur={handleBlur}
        {...props}
      />
      {showExpressionSelect && (
        <Select
          options={options}
          value={selecteExpressionValue}
          onChange={handleExpressionSelect}
        />
      )}
    </>
  );
};
