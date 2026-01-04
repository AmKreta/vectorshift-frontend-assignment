// outputNode.js

import { useEffect } from "react";
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";
import { NODE_TYPES } from "../constants";
import styled from "@emotion/styled";
import { FormControl } from "../components/formControl/formControl";
import { Input } from "../components/Input/input";
import { Select } from "../components/Select/select";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

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
      <Container>
        <FormControl label="Name:">
          <Input type="text" value={currName} onChange={handleNameChange} />
        </FormControl>
        <FormControl label="Type:">
          <Select
            value={outputType}
            onChange={handleTypeChange}
            options={["Text", "Image"]}
          />
        </FormControl>
      </Container>
    </BaseNode>
  );
};
