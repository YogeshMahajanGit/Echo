import { Stack, Typography } from "@mui/material";
import GroupItem from "../shared/GroupItem";

function GroupsList({ w = "100%", myGroup = [], chatId }) {
  return (
    <Stack width={w}>
      {myGroup.length > 0 ? (
        myGroup.map((group) => (
          <GroupItem key={group._id} group={group} chatId={chatId} />
        ))
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No Group
        </Typography>
      )}
    </Stack>
  );
}

export default GroupsList;
