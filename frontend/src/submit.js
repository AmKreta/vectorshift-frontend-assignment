// submit.js

import { Button } from "./components/button/button";

export const SubmitButton = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button type="submit">Submit</Button>
    </div>
  );
};
