/* eslint-disable react/prop-types */
import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import { transformImage } from "../../lib/features";

function AvatarCard({ avatar = [], max = 4 }) {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        <Box width={"3rem"} height={"3rem"}>
          {avatar.map((src, index) => (
            <Avatar
              key={Math.random() * 120}
              src={transformImage(src)}
              alt={`Avatar ${index}`}
              style={{
                border: "2px solid white",
                position: "absolute",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
}

export default AvatarCard;
