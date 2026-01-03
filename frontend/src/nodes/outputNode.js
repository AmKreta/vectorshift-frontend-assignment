// outputNode.js

import { useEffect, useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";
import { NODE_TYPES } from "../constants";

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const currName =
    data?.outputName || id.replace(NODE_TYPES.CUSTOM_OUTPUT + "-", "output_");
  const outputType = data?.outputType || "Text";

  useEffect(() => {
    if (!data?.outputName) {
      updateNodeField(id, "outputName", currName);
    }
    if (!data?.outputType) {
      updateNodeField(id, "outputType", outputType);
    }
  }, [data?.outputName, data?.outputType]);

  const handleNameChange = (e) => {
    updateNodeField(id, "outputName", e.target.value);
  };

  const handleTypeChange = (e) => {
    updateNodeField(id, "outputType", e.target.value);
  };

  const handles = [
    { type: "target", position: Position.Left, id: `${id}-value` },
  ];

  return (
    <BaseNode header="Output" handles={handles}>
      <label>
        Name:
        <input type="text" value={currName} onChange={handleNameChange} />
      </label>
      <label>
        Type:
        <select value={outputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </BaseNode>
  );
};
