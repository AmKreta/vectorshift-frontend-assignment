import styled from "@emotion/styled";

const fontSize = {
  small: "12px",
  medium: "14px",
  large: "16px",
  xlarge: "18px",
  xxlarge: "20px",
  xxxlarge: "22px",
  xxxxlarge: "24px",
};

const fontWeight = {
  light: "300",
  regular: "400",
  medium: "500",
  bold: "600",
  black: "700",
};

const variants = {
  small: {
    fontSize: fontSize.small,
    fontWeight: fontWeight.regular,
    color: "#333",
  },
  medium: {
    fontSize: fontSize.medium,
    fontWeight: fontWeight.medium,
    color: "#333",
  },
  large: {
    fontSize: fontSize.large,
    fontWeight: fontWeight.medium,
    color: "#333",
  },
  xlarge: {
    fontSize: fontSize.xlarge,
    fontWeight: fontWeight.medium,
    color: "#333",
  },
  label: {
    fontSize: fontSize.medium,
    fontWeight: fontWeight.medium,
    color: "#333",
  },
};

const TextContainer = styled.span`
  font-size: ${(props) =>
    props.size || variants[props.variant].fontSize || "14px"};
  font-weight: ${(props) =>
    props.weight || variants[props.variant].fontWeight || "500"};
  color: ${(props) => props.color || variants[props.variant].color || "#333"};
  webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

export function Text({ children, color, weight, size, variant }) {
  return (
    <TextContainer color={color} weight={weight} size={size} variant={variant}>
      {children}
    </TextContainer>
  );
}
