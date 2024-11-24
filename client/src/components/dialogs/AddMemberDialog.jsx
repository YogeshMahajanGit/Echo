import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useState } from "react";

function AddMemberDialog({ addMember, isLoading, chatId }) {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  function handlerSelectMembers(id) {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currEle) => currEle !== id)
        : [...prev, id]
    );
  }

  function handleAddMemberSubmit() {
    handleCloseDialog();
  }

  function handleCloseDialog() {
    console.log("close");
    setSelectedMembers([]);
    setMembers([]);
  }

  return (
    <Dialog open onClose={handleCloseDialog}>
      <Stack p={"2rem"} width={"20rem"} spacing={2}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={2}>
          {members.length > 0 ? (
            members.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={handlerSelectMembers}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          ) : (
            <Typography
              color="warning"
              p={"0.5rem"}
              variant="h5"
              textAlign={"center"}
            >
              No Friends
            </Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button
            variant="contained"
            disable={isLoading}
            onClick={handleAddMemberSubmit}
          >
            Submit
          </Button>
          <Button variant="outlined" color="error" onClick={handleCloseDialog}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default AddMemberDialog;
