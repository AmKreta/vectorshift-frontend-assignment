import { useEffect, useState } from "react";
import { Select } from "../Select/select";

const EditorMode = {
  EXPRESSION: 0,
  STRING: 1,
};

export const ExpressionInput = ({
  value,
  onChange,
  options,
  selectedExpressions, // {value, startIndex, endIndex}
  selectedExpressionsChange,
  ...props
}) => {
  const [editorMode, setEditorMode] = useState(EditorMode.STRING);
  const [selectedExpressionIndex, setSelectedExpressionIndex] = useState(null);
  const [selecteExpressionValue, setSelecteExpressionValue] = useState("");

  const showExpressionSelect = editorMode === EditorMode.EXPRESSION;
  const hasSelectedExpression = selectedExpressionIndex > -1;

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.endsWith("{{")) {
      if (editorMode === EditorMode.EXPRESSION) {
        /// if input is like {{{ then no need to append the value
        // already in expression mode
        return;
      }
      setEditorMode(EditorMode.EXPRESSION);
    }
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
    setEditorMode(EditorMode.STRING);
  };

  const handleInputClick = (e) => {
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
    const currSelectedExpressionIndex = selectedExpressions.findIndex(
      (expression) =>
        selectionStart >= expression.startIndex &&
        selectionEnd <= expression.endIndex
    );
    setSelectedExpressionIndex(currSelectedExpressionIndex);
    const hasSelectedExpression = currSelectedExpressionIndex > -1;
    if (hasSelectedExpression) {
      setSelecteExpressionValue(
        selectedExpressions[currSelectedExpressionIndex].value
      );
      setEditorMode(EditorMode.EXPRESSION);
    } else {
      setSelecteExpressionValue("");
      setEditorMode(EditorMode.STRING);
    }
  };

  const handleBlur = () => {
    if (selectedExpressionIndex > -1) {
    }
    setSelectedExpressionIndex(null);
    setEditorMode(EditorMode.STRING);
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
