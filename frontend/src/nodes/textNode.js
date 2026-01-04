// textNode.js
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";
import { NODE_TYPES } from "../constants";
import { ExpressionInput } from "../components/expressionInput/expressionInput";

const getAvailableInputNodesMap = (nodes) => {
  return new Map(
    nodes
      .filter((node) => node.type === NODE_TYPES.CUSTOM_INPUT)
      .map((node) => [node.id, node])
  );
};

export const TextNode = ({ id, data }) => {
  const { updateNodeField, nodes } = useStore((state) => ({
    updateNodeField: state.updateNodeField,
    nodes: state.nodes,
  }));

  const selectedExpressions = data?.selectedExpressions || [];
  const onSelectedExpressionsChange = (selectedExpressions) => {
    updateNodeField(id, "selectedExpressions", selectedExpressions);
  };

  const availableInputNodesMap = getAvailableInputNodesMap(nodes);
  const availableInputNodesNames = [...availableInputNodesMap.values()].map(
    (node) => node.data.inputName
  );

  const currText = data?.text || "";

  const handleTextChange = (value) => {
    updateNodeField(id, "text", value);
  };

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-output` },
  ];

  return (
    <BaseNode header="Text" handles={handles}>
      <label>
        Text:
        <ExpressionInput
          value={currText}
          onChange={handleTextChange}
          options={availableInputNodesNames}
          selectedExpressions={selectedExpressions}
          onSelectedExpressionsChange={onSelectedExpressionsChange}
        />
      </label>
    </BaseNode>
  );
};
