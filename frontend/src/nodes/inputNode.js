// inputNode.js

import { useEffect } from "react";
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const currName = data?.inputName || id.replace("customInput-", "input_");
  const inputType = data?.inputType || "Text";

  useEffect(() => {
    if (!data?.inputName) {
      updateNodeField(id, "inputName", currName);
    }
    if (!data?.inputType) {
      updateNodeField(id, "inputType", inputType);
    }
  }, [data?.inputName, data?.inputType]);

  const handleNameChange = (e) => {
    updateNodeField(id, "inputName", e.target.value);
  };

  const handleTypeChange = (e) => {
    updateNodeField(id, "inputType", e.target.value);
  };

  const handles = [
    { type: "source", position: Position.Right, id: `${id}-value` },
  ];

  return (
    <BaseNode header="Input" handles={handles}>
      <label>
        Name:
        <input type="text" value={currName} onChange={handleNameChange} />
      </label>
      <label>
        Type:
        <select value={inputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
};
