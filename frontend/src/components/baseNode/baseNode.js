import { Handle } from "reactflow";

export function BaseNode({ header, children, handles }) {
  return (
    <div style={{ width: 200, height: 80, border: "1px solid black" }}>
      {header && <div>{header}</div>}
      {children && <div>{children}</div>}
      {handles?.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            ...(handle.content
              ? {
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                }
              : {}),
            ...handle.style,
          }}
        >
          {handle.content}
        </Handle>
      ))}
    </div>
  );
}
