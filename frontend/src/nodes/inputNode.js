// inputNode.js

import { useEffect } from "react";
import { Position } from "reactflow";
import { BaseNode } from "../components/baseNode/baseNode";
import { useStore } from "../store";
import { NODE_TYPES } from "../constants";
import { Text } from "../components/text/text";
import { Input } from "../components/Input/input";
import styled from "@emotion/styled";
import { FormControl } from "../components/formControl/formControl";
import { Select } from "../components/Select/select";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const currName =
    data?.inputName || id.replace(NODE_TYPES.CUSTOM_INPUT + "-", "input_");
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
      <Container>
        <FormControl label="Name:">
          <Input type="text" value={currName} onChange={handleNameChange} />
        </FormControl>
        <FormControl label="Type:">
          <Select
            value={inputType}
            onChange={handleTypeChange}
            options={["Text", "Image"]}
          />
        </FormControl>
      </Container>
    </BaseNode>
  );
};
