import { styled } from "@mui/material";

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
