import { keyframes, Skeleton, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor, lightOrange, orange } from "../../constants/color";

export const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0000)",
  height: 1,
  width: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
});

export const Link = styled(LinkComponent)({
  textDecoration: "none",
  color: "black",
  borderRadius: "0.6rem",
  ":hover": {
    border: `1px solid ${orange}`,
    backgroundColor: `${lightOrange}`,
  },
});

export const InputBox = styled("input")({
  width: "100%",
  height: "100%",
  border: "none",
  outlineColor: `${orange}`,
  padding: "0 1rem",
  borderRadius: "1.5rem",
  backgroundColor: `${grayColor}`,
});

export const SearchField = styled("input")({
  padding: "1rem 2rem",
  width: "20vmax",
  border: "none",
  outline: "none",
  borderRadius: "1.5rem",
  backgroundColor: `${grayColor}`,
  fontSize: "1.1rem",
});

export const CurveButton = styled("button")({
  borderRadius: "1.5rem",
  padding: "1rem 1rem",
  cursor: "pointer",
  border: "none",
  outline: "none",
  backgroundColor: "black",
  color: "white",
  fontSize: "1rem",
  ":hover": {
    backgroundColor: "rgba(0,0,0,0.8)",
  },
});
