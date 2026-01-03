import { useState } from "react";
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
  const [selectedExpressionIndex, setSelectedExpressionIndex] = useState(-1);
  const [selecteExpressionValue, setSelecteExpressionValue] = useState("");
  const [expressionSearchValue, setExpressionSearchValue] = useState("");

  const showExpressionSelect = editorMode === EditorMode.EXPRESSION;
  const hasSelectedExpression = selectedExpressionIndex > -1;

  const filteredOptions = expressionSearchValue
    ? options.filter((option) => option.includes(expressionSearchValue))
    : options;

  const handlekeyPress = (e) => {
    const key = e.key;
    if (key === "{" && editorMode === EditorMode.EXPRESSION) {
      e.stopPropagation();
    }
    if (key === "Backspace" && editorMode === EditorMode.EXPRESSION) {
      e.stopPropagation();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (editorMode === EditorMode.EXPRESSION) {
      setExpressionSearchValue(val.replace(value, ""));
      return;
    }
    if (val.endsWith("{{")) {
      setEditorMode(EditorMode.EXPRESSION);
    }
    onChange(e.target.value);
  };

  const updateExpressionIndexes = (lengthChange) => {
    for (
      let i = selectedExpressionIndex + 1;
      i < selectedExpressions.length;
      i++
    ) {
      selectedExpressions[i].startIndex += lengthChange;
      selectedExpressions[i].endIndex += lengthChange;
    }
  };

  const handleExpressionSelect = (e) => {
    const val = e.target.value;
    if (hasSelectedExpression) {
      const selectedExpressionsCopy = [...selectedExpressions];
      const oldExpression = selectedExpressionsCopy[selectedExpressionIndex];
      const newText =
        value.slice(0, oldExpression.startIndex) +
        val +
        value.slice(oldExpression.endIndex);

      const lengthChange = val.length - oldExpression.value.length;
      selectedExpressionsCopy[selectedExpressionIndex] = {
        value: val,
        startIndex: oldExpression.startIndex,
        endIndex: oldExpression.endIndex + lengthChange,
      };
      updateExpressionIndexes(lengthChange);
      selectedExpressionsChange(selectedExpressionsCopy);
      onChange(newText);
    } else {
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
    }
    setEditorMode(EditorMode.STRING);
    setExpressionSearchValue("");
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
    setSelectedExpressionIndex(-1);
    setEditorMode(EditorMode.STRING);
  };

  return (
    <>
      <input
        type="text"
        value={value + expressionSearchValue}
        onChange={handleChange}
        onClick={handleInputClick}
        onKeyDown={handlekeyPress}
        // onBlur={handleBlur}
        {...props}
      />
      {showExpressionSelect && (
        <Select
          options={filteredOptions}
          value={selecteExpressionValue}
          onChange={handleExpressionSelect}
        />
      )}
    </>
  );
};
