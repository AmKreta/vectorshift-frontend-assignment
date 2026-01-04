import { useEffect, useRef, useState } from "react";

export function useAfterNextRender() {
  const cbRefs = useRef([]);
  const [state, setState] = useState();
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    cbRefs.current.forEach((cb) => cb());
    cbRefs.current = [];
  }, [state]);

  return function (cb) {
    cbRefs.current.push(cb);
    setState(!state);
  };
}
