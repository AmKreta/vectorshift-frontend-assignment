import { Handle } from "reactflow";
import styled from "@emotion/styled";
import { Text } from "../text/text";

const Container = styled.div`
  min-height: 80px;
  width: 200px;
  border: 1px solid black;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  font-size: 14px;
  padding: 8px 16px;
  border-bottom: 1px solid black;
  background-color: #1c2536;
`;

const Content = styled.div`
  padding: 8px 16px;
`;

export function BaseNode({ header, children, handles }) {
  return (
    <Container>
      {header && (
        <Header>
          {typeof header === "string" ? (
            <Text size="14px" weight="500" color="rgb(236, 235, 235)">
              {header}
            </Text>
          ) : (
            header
          )}
        </Header>
      )}
      {children && (
        <Content>
          {typeof children === "string" ? (
            <Text size="20px" weight="450">
              {children}
            </Text>
          ) : (
            children
          )}
        </Content>
      )}
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
              : {
                  height: "10px",
                  width: "10px",
                }),
            ...handle.style,
          }}
        >
          {handle.content}
        </Handle>
      ))}
    </Container>
  );
}
