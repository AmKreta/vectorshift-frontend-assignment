import { useMemo, useRef, useState } from "react";
import { Select } from "../Select/select";
import { useAfterNextRender } from "../../hooks/useAfterNextRender";
import { Input } from "../Input/input";

const EditorMode = {
  EXPRESSION: 0,
  STRING: 1,
};

export const ExpressionInput = ({
  value,
  onChange,
  options,
  selectedExpressions, // {value, startIndex, endIndex}
  onSelectedExpressionsChange,
  ...props
}) => {
  const [editorMode, setEditorMode] = useState(EditorMode.STRING);
  const [selectedExpressionIndex, setSelectedExpressionIndex] = useState(-1);
  const [selecteExpressionValue, setSelecteExpressionValue] = useState("");
  const [lockCaret, setLockCaret] = useState(false);

  const inputRef = useRef(null);
  const afterNextRender = useAfterNextRender();

  const hasSelectedExpression = selectedExpressionIndex > -1;
  const selectedExpression = selectedExpressions[selectedExpressionIndex];

  /**
   * when user is entering a new expression, expression mode is active,
   * but no new expression is added till user presses a closing bracket
   * this function returns that temporary expression value
   */
  const currentlyEnteringExpression = useMemo(() => {
    if (editorMode !== EditorMode.EXPRESSION || selectedExpressionIndex > -1) {
      return "";
    }
    let i = value.length - 1;
    let found = false;
    while (i >= 2) {
      if (value[i - 1] === "{" && value[i - 2] === "{") {
        found = true;
        break;
      }
      i--;
    }
    if (found) {
      return value.slice(i, value.length);
    }
    return "";
  }, [value, editorMode, selectedExpressionIndex]);

  const showExpressionSelect =
    options?.length && editorMode === EditorMode.EXPRESSION
      ? !selectedExpression ||
        options.findIndex((option) => option === selectedExpression.value) ===
          -1
      : false;

  const filteredOptions = useMemo(() => {
    const filteredOptions = [];
    const query = selectedExpression
      ? selectedExpression.value
      : currentlyEnteringExpression;
    for (let i = 0; i < options.length; i++) {
      if (!query) {
        filteredOptions.push(options[i]);
      } else if (options[i].includes(query)) {
        filteredOptions.push(options[i]);
      }
    }
    return filteredOptions;
  }, [options, selectedExpression, currentlyEnteringExpression]);

  /**
   * tempExpression is the expression currentlyBeing entered by user
   * eg user presses } or selects after entering{{exp , exp is temp expression
   */
  function addExpression(
    expressionValue,
    removeTempExpressionFromValue = false
  ) {
    if (removeTempExpressionFromValue && currentlyEnteringExpression.length) {
      value = value.slice(0, -currentlyEnteringExpression.length);
    }
    const newText = value + expressionValue + "}}";
    const newVal = {
      value: expressionValue,
      startIndex: value.length,
      endIndex: value.length + expressionValue.length,
    };
    onSelectedExpressionsChange([...selectedExpressions, newVal]);
    afterNextRender(() => {
      inputRef.current.focus();
      const endPosition = newVal.endIndex + 2;
      inputRef.current.setSelectionRange(endPosition, endPosition);
    });
    onChange(newText);
  }

  /**
   * pass input value here
   * if any expression is being edited, compares the expression old and new value
   * and updates the expression indexes and text of the input
   */
  function updateExpressionByComparingOldAndNewValues(val) {
    if (selectedExpressionIndex <= -1) {
      return;
    }
    const oldExpression = selectedExpressions[selectedExpressionIndex];

    const lengthChange = val.length - oldExpression.value.length;
    const newVal = {
      value: val,
      startIndex: oldExpression.startIndex,
      endIndex: oldExpression.endIndex + lengthChange,
    };
    updateExpressionAtIndex(newVal);
    return newVal;
  }

  function updateExpressionAtIndex(newVal, index = selectedExpressionIndex) {
    const oldExpression = selectedExpressions[index];
    const lengthChange = newVal.value.length - oldExpression.value.length;
    selectedExpressions[index] = newVal;
    updateExpressionIndexes(selectedExpressions, lengthChange);
    onSelectedExpressionsChange([...selectedExpressions]);
    const newText =
      value.slice(0, oldExpression.startIndex) +
      newVal.value +
      value.slice(oldExpression.endIndex);
    onChange(newText);
    afterNextRender(() => {
      inputRef.current.focus();
      const endPosition = newVal.endIndex + 2;
      inputRef.current.setSelectionRange(endPosition, endPosition);
    });
  }

  function deleteExpression(deleteIndex) {
    const selectedExpressionsCopy = [...selectedExpressions];
    const deletedExpression = selectedExpressionsCopy.splice(deleteIndex, 1)[0];
    const deletedValuelength =
      deletedExpression.endIndex - deletedExpression.startIndex + 4; /*{{}} */
    const lengthChange = deletedValuelength * -1;
    updateExpressionIndexes(selectedExpressionsCopy, lengthChange, deleteIndex);
    onSelectedExpressionsChange(selectedExpressionsCopy);
    const newText =
      value.slice(0, deletedExpression.startIndex - 2) +
      value.slice(deletedExpression.endIndex + 2);
    onChange(newText);
    inputRef.current.setSelectionRange(
      deletedExpression.endIndex + lengthChange,
      deletedExpression.endIndex + lengthChange
    );
    setEditorMode(EditorMode.STRING);
    setLockCaret(false);
    setSelectedExpressionIndex(-1);
  }

  /**
   * tries to select an expression from begining to end
   * selects an expression from begining to end
   * lock means caret is selected from begining to end
   * if no expression is found, sets editor mode to string
   */
  function trySelectAndLockExpression(index) {
    setSelectedExpressionIndex(index);
    const hasSelectedExpression = index > -1;
    if (hasSelectedExpression) {
      const selectedExpression = selectedExpressions[index];
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
  }

  /**
   * unlocks the expression
   * caret is not selected from begining to end
   * you can edit the expression using keyboard input after calling this function
   */
  function unlockSelecedExpression(caretPosition) {
    setLockCaret(false);
    inputRef.current.setSelectionRange(caretPosition, caretPosition);
  }

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
      return;
    }

    /*
      deleting an expression
      when an expression is seleced and user presses backspoace or delete
    */
    if ((key === "Backspace" || key === "Delete") && isExpressionMode) {
      if (selectedExpressionIndex > -1) {
        const selectedExpression = selectedExpressions[selectedExpressionIndex];
        if (lockCaret) {
          e.preventDefault();
          deleteExpression(selectedExpressionIndex);
          return;
        }

        if (!selectedExpression.value) {
          e.preventDefault();
          deleteExpression(selectedExpressionIndex);
          return;
        }

        const caretPosition = e.target.selectionStart;
        const wantsToDeleteExpression =
          caretPosition === selectedExpression.startIndex;
        if (wantsToDeleteExpression) {
          deleteExpression(selectedExpressionIndex);
          return;
        }
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
      trySelectAndLockExpression(closestExpressionIndex);
    }

    const leftKey = "ArrowLeft";
    const rightKey = "ArrowRight";
    const leftKeyPressed = key === leftKey;
    const rightKeyPressed = key === rightKey;
    const leftOrRightPressed = leftKeyPressed || rightKeyPressed;

    if (leftOrRightPressed) {
      const aboutToEnterExpression = leftKeyPressed
        ? value[caretPosition - 1] === "}"
        : rightKeyPressed
        ? value[caretPosition] === "{"
        : false;
      /**
       * when user navigates using left or right key and expression mode is not active,
       * when user finds an expression either start or end eg |{{expression}} or {{expression}}|
       * then select whole expression
       * then user can press backspace or delete to delete it (code is above)
       * or he can selct a new expression
       */
      if (!isExpressionMode && aboutToEnterExpression) {
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
          trySelectAndLockExpression(closestExpressionIndex);
        } else {
          setLockCaret(false);
        }
        return;
      }

      /**
       * true when user is about to exit an expression
       */
      const aboutToExitExpression = leftKeyPressed
        ? value[caretPosition - 1] === "{"
        : rightKeyPressed
        ? value[caretPosition] === "}"
        : false;

      /**
       * don't let user play with braces, if expression is not selected and user is about to exit an expression
       * then move the caret to the start or end of the expression including the braces
       */
      if (isExpressionMode && aboutToExitExpression && !lockCaret) {
        e.preventDefault();
        const selectedExpression = selectedExpressions[selectedExpressionIndex];
        const newCaretPosition = leftKeyPressed
          ? selectedExpression.startIndex - 2
          : selectedExpression.endIndex + 2;
        inputRef.current.setSelectionRange(newCaretPosition, newCaretPosition);
        setEditorMode(EditorMode.STRING);
        setLockCaret(false);
        return;
      }

      const caretIsInsideExpression =
        isExpressionMode && selectedExpressionIndex > -1;
      /**
       * if an expression is already selected and user presses left or right
       * then move the caret inside the expression
       * if right key is pressed then move the caret to the end of the expression
       * if left key is pressed then move the caret to the start of the expression
       */
      if (caretIsInsideExpression) {
        const selectedExpression = selectedExpressions[selectedExpressionIndex];
        if (!lockCaret) {
          return;
        }
        e.preventDefault();
        if (leftKeyPressed) {
          unlockSelecedExpression(selectedExpression.startIndex);
        } else if (rightKeyPressed) {
          unlockSelecedExpression(selectedExpression.endIndex);
        }
      }
    }
  };

  const handleKeyRelease = (e) => {
    const key = e.key;
    const isExpressionMode = editorMode === EditorMode.EXPRESSION;
    const caretPosition = e.target.selectionStart;
    const upKey = "ArrowUp";
    const downKey = "ArrowDown";
    const upKeyPressed = key === upKey;
    const downKeyPressed = key === downKey;

    const upOrDownPressed = upKeyPressed || downKeyPressed;
    if (upOrDownPressed) {
      if (hasSelectedExpression && lockCaret) {
        // disselect this expression
        setLockCaret(false);
        setSelectedExpressionIndex(-1);
        setEditorMode(EditorMode.STRING);
      }

      const insideExpressionAtIndex = selectedExpressions.findIndex(
        (expression) =>
          caretPosition >= expression.startIndex &&
          caretPosition <= expression.endIndex
      );
      if (insideExpressionAtIndex === -1) {
        return;
      }
      e.preventDefault();
      trySelectAndLockExpression(insideExpressionAtIndex);
      return;
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;

    if (editorMode === EditorMode.EXPRESSION) {
      /**
       * expression being edited here
       * we need to update the value and indexes of the expression
       * and update the text of the input
       * and update indexes of other expressions
       */
      let selectedExpression = selectedExpressions[selectedExpressionIndex];
      if (selectedExpression) {
        // expression being edited
        let i = selectedExpression.startIndex;
        while (val[i] !== "}") {
          i++;
        }
        const value = val.slice(selectedExpression.startIndex, i);
        const newExpression = updateExpressionByComparingOldAndNewValues(value);
        const endPosition = newExpression.endIndex;
        queueMicrotask(() => {
          inputRef.current.setSelectionRange(endPosition, endPosition);
        });
        return;
      }
      if (val.endsWith("}}")) {
        // user has pressed a closing bracket
        // creating a new expression
        let i = val.length - 1;
        while (i >= 2 && !(val[i - 1] === "{" && val[i - 2] === "{")) {
          i--;
        }
        const foundOpeninfBraces = i >= 1;
        if (i >= 1) {
          setEditorMode(EditorMode.STRING);
          // -2 for excluding }
          addExpression(val.slice(i, val.length - 2), true);
          return;
        }
      }
    } else {
      setEditorMode(
        val.endsWith("{{") ? EditorMode.EXPRESSION : EditorMode.STRING
      );
    }

    onChange(val);
  };

  const handleExpressionSelect = (val) => {
    if (hasSelectedExpression) {
      const selectedExpression = selectedExpressions[selectedExpressionIndex];
      if (selectedExpression.value.length) {
        // ie user entered some value and then selected an expression
        // we need to remove the value entered by the user
        let i = selectedExpression.startIndex;
        while (i < value.length && value[i] !== "}" && value[i] !== "{") {
          i++;
        }
        value =
          value.slice(0, selectedExpression.startIndex) +
          value.slice(selectedExpression.startIndex, i) +
          "}}";
      }
      updateExpressionByComparingOldAndNewValues(val);
    } else {
      addExpression(val, true);
    }

    setEditorMode(EditorMode.STRING);
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
      unlockSelecedExpression(selectionEnd);
      return;
    }
    trySelectAndLockExpression(currSelectedExpressionIndex);
  };

  const handleBlur = () => {
    if (selectedExpressionIndex > -1) {
    }
    setSelectedExpressionIndex(-1);
    setEditorMode(EditorMode.STRING);
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onClick={handleInputClick}
        onKeyDown={handlekeyPress}
        onKeyUp={handleKeyRelease}
        dynamicHeight
        // onBlur={handleBlur}
        {...props}
      />
      {showExpressionSelect && (
        <Select
          options={filteredOptions}
          value={selecteExpressionValue}
          onChange={handleExpressionSelect}
          open={true}
          showHeader={false}
        />
      )}
    </>
  );
};
