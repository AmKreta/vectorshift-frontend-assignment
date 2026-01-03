// textNode.js

import { useState } from "react";
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
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
