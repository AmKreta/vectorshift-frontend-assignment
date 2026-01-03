import { NODE_TYPES } from "../constants";

export const useNodeOfType = (type) => {
  const x = useStore((state) => state.nodes);
  return x.filter((node) => node.type === type);
};
