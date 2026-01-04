// llmNode.js

import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { Text } from "../components/text/text";

export const LLMNode = ({ id, data }) => {
  const handles = [
    {
      type: "target",
      position: Position.Left,
      id: `${id}-system`,
      style: { top: `${100 / 3}%` },
    },
    {
      type: "target",
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: `${200 / 3}%` },
    },
    { type: "source", position: Position.Right, id: `${id}-response` },
  ];
  return (
    <BaseNode header="LLM" handles={handles}>
      <Text variant="medium">This is a LLM.</Text>
    </BaseNode>
  );
};
