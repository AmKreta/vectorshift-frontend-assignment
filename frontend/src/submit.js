// submit.js

import { Button } from "./components/button/button";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodes: nodes,
          edges: edges,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Display alert with the response
      const dagStatus = data.is_dag ? "Yes" : "No";
      alert(
        `Pipeline Analysis Results:\n\n` +
          `Number of Nodes: ${data.num_nodes}\n` +
          `Number of Edges: ${data.num_edges}\n` +
          `Is DAG: ${dagStatus}`
      );
    } catch (error) {
      console.error("Error submitting pipeline:", error);
      alert(`Error submitting pipeline: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button type="button" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};
