// textNode.js

import { useMemo, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";
import { NODE_TYPES } from "../constants";

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

  const availableInputNodesMap = getAvailableInputNodesMap(nodes);
  const availableInputNodesNames = [...availableInputNodesMap.values()].map(
    (node) => node.data.inputName
  );

  const currText = data?.text || "{{input}}";

  const showInputSelect = currText.endsWith("{{");

  const handleTextChange = (e) => {
    updateNodeField(id, "text", e.target.value);
  };

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-output` },
  ];

  return (
    <BaseNode header="Text" handles={handles}>
      <label>
        Text:
        <input type="text" value={currText} onChange={handleTextChange} />
      </label>
      {showInputSelect && <div>input dropdown</div>}
    </BaseNode>
  );
};
