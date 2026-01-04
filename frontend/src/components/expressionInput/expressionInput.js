import { useRef, useState } from "react";
import { Select } from "../Select/select";
import { useAfterNextRender } from "../../hooks/useAfterNextRender";

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
  const [lockCaret, setLockCaret] = useState(false);

  const inputRef = useRef(null);
  const afterNextRender = useAfterNextRender();

  const showExpressionSelect = editorMode === EditorMode.EXPRESSION;
  const hasSelectedExpression = selectedExpressionIndex > -1;

  const filteredOptions = expressionSearchValue
    ? options.filter((option) => option.includes(expressionSearchValue))
    : options;

  function deleteExpression(deleteIndex) {
    const selectedExpressionsCopy = [...selectedExpressions];
    const deletedExpression = selectedExpressionsCopy.splice(deleteIndex, 1)[0];
    const deletedValuelength =
      deletedExpression.endIndex - deletedExpression.startIndex + 4; /*{{}} */
    const lengthChange = deletedValuelength * -1;
    updateExpressionIndexes(selectedExpressionsCopy, lengthChange, deleteIndex);
    selectedExpressionsChange(selectedExpressionsCopy);
    const newText =
      value.slice(0, deletedExpression.startIndex - 2) +
      value.slice(deletedExpression.endIndex + 2);
    onChange(newText);
  }

  const handlekeyPress = (e) => {
    const key = e.key;
    const isExpressionMode = editorMode === EditorMode.EXPRESSION;
    const caretPosition = e.target.selectionStart;

    /**
     * when user has typed {{ don't let him write another opening bracket
     * we identify this by checking last char and if expression mode is active
     */
    if (key === "{" && isExpressionMode) {
      e.preventDefault();
    }

    /*
      deleting an expression
      when an expression is seleced and user presses backspoace or delete
    */
    if (key === "Backspace" || (key === "Delete" && isExpressionMode)) {
      if (selectedExpressionIndex > -1) {
        e.preventDefault();
        const selectedExpression = selectedExpressions[selectedExpressionIndex];
        deleteExpression(selectedExpressionIndex);
        e.target.setSelectionRange(
          selectedExpression.startIndex,
          selectedExpression.startIndex
        );
        setEditorMode(EditorMode.STRING);
        setLockCaret(false);
        return;
      }
    }

    /**
     * user trying to delete whole value by pressing backspace,
     * if user starts to delete a espression node something like {{espression}}|
     * select whole expression first, then user can pres backspace or delete to delete it (code is above)
     * or if user presses left right, let user edit the expression
     */
    if (key === "Backspace" && value.endsWith("}")) {
      const closestExpressionIndex = selectedExpressions.findIndex(
        (expression) => caretPosition === expression.endIndex + 2
      );
      if (closestExpressionIndex === -1) {
        // in case input starts with }
        return;
      }
      // don't let user delete the closing bracket
      e.preventDefault();
      const selectedExpression = selectedExpressions[closestExpressionIndex];
      e.target.setSelectionRange(
        selectedExpression.startIndex,
        selectedExpression.endIndex
      );
      setEditorMode(EditorMode.EXPRESSION);
      setSelectedExpressionIndex(closestExpressionIndex);
      setSelecteExpressionValue(selectedExpression.value);
      setLockCaret(true);
    }

    const leftKey = "ArrowLeft";
    const rightKey = "ArrowRight";
    const leftKeyPressed = key === leftKey;
    const rightKeyPressed = key === rightKey;

    const leftOrRightPressed = leftKeyPressed || rightKeyPressed;
    const aboutToEnterExpression = leftKeyPressed
      ? value[caretPosition - 1] === "}"
      : rightKeyPressed
      ? value[caretPosition + 1] === "}"
      : false;

    /**
     * when user navigates using left or right key and expression mode is not active,
     * when user finds an expression either start or end eg |{{expression}} or {{expression}}|
     * then select whole expression
     * then user can press backspace or delete to delete it (code is above)
     * or he can selct a new expression
     */
    if (leftOrRightPressed && !isExpressionMode && aboutToEnterExpression) {
      e.preventDefault();
      let closestExpressionIndex = -1;
      if (key === "ArrowLeft") {
        closestExpressionIndex = selectedExpressions.findIndex(
          (expression) => caretPosition === expression.endIndex + 2
        );
      } else if (key === "ArrowRight") {
        closestExpressionIndex = selectedExpressions.findIndex(
          (expression) => caretPosition === expression.startIndex - 2
        );
      }
      if (closestExpressionIndex > -1) {
        const selectedExpression = selectedExpressions[closestExpressionIndex];
        e.target.setSelectionRange(
          selectedExpression.startIndex,
          selectedExpression.endIndex
        );
        setEditorMode(EditorMode.EXPRESSION);
        setSelectedExpressionIndex(closestExpressionIndex);
        setSelecteExpressionValue(selectedExpression.value);
        setLockCaret(true);
      } else {
        setLockCaret(false);
      }
    }

    const caretIsInsideExpression =
      isExpressionMode && selectedExpressionIndex > -1;
    /**
     * if an expression is already selected and user presses left or right
     * then move the caret inside the expression
     * if right key is pressed then move the caret to the end of the expression
     * if left key is pressed then move the caret to the start of the expression
     */
    if (leftOrRightPressed && caretIsInsideExpression) {
      const selectedExpression = selectedExpressions[selectedExpressionIndex];
      if (!lockCaret) {
        return;
      }
      e.preventDefault();
      if (leftKeyPressed) {
        e.target.setSelectionRange(
          selectedExpression.startIndex,
          selectedExpression.startIndex
        );
      } else if (rightKeyPressed) {
        e.target.setSelectionRange(
          selectedExpression.endIndex,
          selectedExpression.endIndex
        );
      }
      setLockCaret(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;

    if (editorMode === EditorMode.EXPRESSION) {
      if (val.length < value.length) {
        // ie user has pressed backspace
        // we no longer want to be in expression mode, cuz val us like abc {
        setEditorMode(EditorMode.STRING);
        setExpressionSearchValue("");
        onChange(val);
        return;
      }
      if (val.endsWith("}")) {
        // user has pressed a closing bracket
        setEditorMode(EditorMode.STRING);
        setExpressionSearchValue("");
        onChange(val + "}");
        return;
      }
    }

    // after writing {{, we don't update value
    // instead, we update expressionSearchValue
    // and display this value in the input
    if (editorMode === EditorMode.EXPRESSION) {
      const expressionSearchValue = val.replace(value, "");
      setExpressionSearchValue(val.replace(value, ""));
      return;
    }

    setEditorMode(
      val.endsWith("{{") ? EditorMode.EXPRESSION : EditorMode.STRING
    );

    onChange(val);
  };

  const updateExpressionIndexes = (
    expressions,
    lengthChange,
    index = selectedExpressionIndex + 1
  ) => {
    for (let i = index; i < expressions.length; i++) {
      expressions[i].startIndex += lengthChange;
      expressions[i].endIndex += lengthChange;
    }
  };

  const handleExpressionSelect = (e) => {
    const val = e.target.value;
    if (hasSelectedExpression) {
      /**
       * editing an expression
       */
      const selectedExpressionsCopy = [...selectedExpressions];
      const oldExpression = selectedExpressionsCopy[selectedExpressionIndex];
      const newText =
        value.slice(0, oldExpression.startIndex) +
        val +
        value.slice(oldExpression.endIndex);

      const lengthChange = val.length - oldExpression.value.length;
      const newVal = {
        value: val,
        startIndex: oldExpression.startIndex,
        endIndex: oldExpression.endIndex + lengthChange,
      };
      selectedExpressionsCopy[selectedExpressionIndex] = newVal;
      updateExpressionIndexes(selectedExpressionsCopy, lengthChange);
      selectedExpressionsChange(selectedExpressionsCopy);
      onChange(newText);
      afterNextRender(() => {
        inputRef.current.focus();
        const endPosition = newVal.endIndex + 2;
        inputRef.current.setSelectionRange(endPosition, endPosition);
      });
    } else {
      /**
       * adding a new expression
       */
      const newText = value + val + "}}";
      const newVal = {
        value: val,
        startIndex: value.length,
        endIndex: value.length + val.length,
      };
      selectedExpressionsChange([...selectedExpressions, newVal]);
      afterNextRender(() => {
        inputRef.current.focus();
        const endPosition = newVal.endIndex + 2;
        inputRef.current.setSelectionRange(endPosition, endPosition);
      });
      onChange(newText);
    }

    setEditorMode(EditorMode.STRING);
    setExpressionSearchValue("");
    setLockCaret(false);
    setSelecteExpressionValue("");
    setSelectedExpressionIndex(-1);
  };

  const handleInputClick = (e) => {
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;
    const currSelectedExpressionIndex = selectedExpressions.findIndex(
      (expression) =>
        selectionStart >= expression.startIndex &&
        selectionEnd <= expression.endIndex
    );
    if (currSelectedExpressionIndex === selectedExpressionIndex) {
      // clicked on same expresion twice
      setLockCaret(false);
      e.target.setSelectionRange(selectionEnd, selectionEnd);
      return;
    }
    setSelectedExpressionIndex(currSelectedExpressionIndex);
    const hasSelectedExpression = currSelectedExpressionIndex > -1;
    if (hasSelectedExpression) {
      const selectedExpression =
        selectedExpressions[currSelectedExpressionIndex];
      setSelecteExpressionValue(selectedExpression.value);
      setEditorMode(EditorMode.EXPRESSION);
      setLockCaret(true);
      inputRef.current.setSelectionRange(
        selectedExpression.startIndex,
        selectedExpression.endIndex
      );
    } else {
      setSelecteExpressionValue("");
      setEditorMode(EditorMode.STRING);
      setLockCaret(false);
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
        ref={inputRef}
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
