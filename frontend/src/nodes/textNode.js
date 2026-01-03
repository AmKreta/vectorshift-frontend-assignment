// textNode.js

import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const currText = data?.text || "{{input}}";

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
    </BaseNode>
  );
};
