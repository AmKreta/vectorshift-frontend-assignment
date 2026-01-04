// textNode.js
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";
import { NODE_TYPES } from "../constants";
import { ExpressionInput } from "../components/expressionInput/expressionInput";
import { FormControl } from "../components/formControl/formControl";
import { useMemo } from "react";
import styled from "@emotion/styled";
import { Text } from "../components/text/text";

const HandleLabel = styled.div`
  position: absolute;
  left: calc(0% - 4px);
  top: calc(0% - 4px);
  transform: translate(-100%, -70%);
`;

export const TextNode = ({ id, data }) => {
  const { updateNodeField } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
    nodes: state.nodes,
  }));

  const selectedExpressions = data?.selectedExpressions || [];
  const onSelectedExpressionsChange = (selectedExpressions) => {
    updateNodeField(id, "selectedExpressions", selectedExpressions);
  };

  const currText = data?.text || "";

  const handleTextChange = (value) => {
    updateNodeField(id, "text", value);
  };

  const dynamicHandles = useMemo(() => {
    const handleMap = new Map();
    for (let i = 0; i < selectedExpressions.length; i++) {
      const expression = selectedExpressions[i];
      handleMap.set(expression.value, {
        type: "target",
        position: Position.Left,
        id: `${id}-${expression.value}`,
        style: {
          top: `${((i + 1) / (selectedExpressions.length + 1)) * 100}%`,
        },
        content: (
          <HandleLabel>
            <Text variant="small" weight="medium">
              {expression.value}
            </Text>
          </HandleLabel>
        ),
      });
    }
    return handleMap;
  }, [selectedExpressions]);

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-output` },
    ...dynamicHandles.values(),
  ];

  return (
    <BaseNode header="Text" handles={handles}>
      <FormControl label="Text:">
        <ExpressionInput
          value={currText}
          onChange={handleTextChange}
          selectedExpressions={selectedExpressions}
          onSelectedExpressionsChange={onSelectedExpressionsChange}
        />
      </FormControl>
    </BaseNode>
  );
};
