// toolbar.js

import { DraggableNode } from "./draggableNode";
import { NODE_TYPES } from "./constants";

export const PipelineToolbar = () => {
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <DraggableNode type={[NODE_TYPES.CUSTOM_INPUT]} label="Input" />
        <DraggableNode type={[NODE_TYPES.LLM]} label="LLM" />
        <DraggableNode type={[NODE_TYPES.CUSTOM_OUTPUT]} label="Output" />
        <DraggableNode type={[NODE_TYPES.TEXT]} label="Text" />
      </div>
    </div>
  );
};
