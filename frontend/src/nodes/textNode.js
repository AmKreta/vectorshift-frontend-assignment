// textNode.js
import { Position, useReactFlow } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";
import { NODE_TYPES } from "../constants";
import { ExpressionInput } from "../components/expressionInput/expressionInput";
import { FormControl } from "../components/formControl/formControl";
import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { Text } from "../components/text/text";
import { useAfterNextRender } from "../hooks/useAfterNextRender";

const HandleLabel = styled.div`
  position: absolute;
  left: calc(0% - 4px);
  top: calc(0% - 4px);
  transform: translate(-100%, -70%);
`;

const getAvailableInputNodesMap = (nodes) => {
  return new Map(
    nodes
      .filter((node) => node.type === NODE_TYPES.CUSTOM_INPUT)
      .map((node) => [node.data.inputName, node])
  );
};

export const TextNode = ({ id, data }) => {
  const afterNextRender = useAfterNextRender();
  const { deleteElements } = useReactFlow();

  const { updateNodeField, nodes, addEdge } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
    nodes: state.nodes,
    addEdge: state.onConnect,
  }));

  const availableInputNodesMap = getAvailableInputNodesMap(nodes);
  const availableInputNodesNames = [...availableInputNodesMap.values()].map(
    (node) => node.data.inputName
  );

  const selectedExpressions = data?.selectedExpressions || [];

  const oldSelectedExpressionsRef = useRef(selectedExpressions);
  oldSelectedExpressionsRef.current = selectedExpressions;

  const onSelectedExpressionsChange = (selectedExpressions) => {
    updateNodeField(id, "selectedExpressions", selectedExpressions);
    afterNextRender(() => {
      const deletedEdges = [];
      for (let i = 0; i < oldSelectedExpressionsRef.current.length; i++) {
        const expression = oldSelectedExpressionsRef.current[i];
        const node = availableInputNodesMap.get(expression.value);
        if (node) {
          if (!selectedExpressions.find((e) => e.value === expression.value)) {
            deletedEdges.push({ id: `${node.id}-${id}-${expression.value}` });
          }
        }
      }
      deleteElements({
        edges: deletedEdges,
      });

      for (let i = 0; i < selectedExpressions.length; i++) {
        const expression = selectedExpressions[i];
        const node = availableInputNodesMap.get(expression.value);
        if (node) {
          const edge = {
            id: `${node.id}-${id}-${expression.value}`,
            source: node.id,
            target: id,
            sourceHandle: `${node.id}-value`,
            targetHandle: `${id}-${expression.value}`,
          };
          addEdge(edge);
        }
      }
    });
  };

  const currText = data?.text || "";

  const handleTextChange = (value) => {
    updateNodeField(id, "text", value);
  };

  const dynamicHandles = useMemo(() => {
    const handleMap = new Map();
    for (let i = 0; i < selectedExpressions.length; i++) {
      const expression = selectedExpressions[i];
      if (!availableInputNodesMap.has(expression.value)) {
        continue;
      }
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
  }, [selectedExpressions, availableInputNodesMap]);

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-output` },
    ...dynamicHandles.values(),
  ];

  return (
    <BaseNode header="Text" handles={handles}>
      <FormControl>
        <ExpressionInput
          value={currText}
          onChange={handleTextChange}
          selectedExpressions={selectedExpressions}
          onSelectedExpressionsChange={onSelectedExpressionsChange}
          options={availableInputNodesNames}
        />
      </FormControl>
    </BaseNode>
  );
};
