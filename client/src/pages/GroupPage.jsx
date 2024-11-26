import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  Delete,
  Done,
  Edit,
  KeyboardBackspace,
  Menu,
} from "@mui/icons-material";
import { btnBg, btnBgLight } from "../components/constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconBtn from "../components/shared/IconBtn";
import { lazy, Suspense, useEffect, useState } from "react";
import GroupsList from "../components/specific/GroupsList";
import { chatSample, sampleUsers } from "../components/constants/sampleData";
import UserItem from "../components/shared/UserItem";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const isAddMember = false;

function GroupPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdated, setGroupNameUpdated] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();

  useEffect(() => {
    setGroupName(`Group Name`);
    setGroupNameUpdated("Group Name");

    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setIsEdit(false);
    };
  }, [chatId]);

  function handleNavigateBack() {
    navigate("/");
  }

  function handleMobile() {
    setIsMenuOpen((prev) => !prev);
  }

  function handleMenuClose() {
    setIsMenuOpen(false);
  }

  function handleUpdateGroupName() {
    setIsEdit(false);
  }

  function handleOpenConfirmDelete() {
    setConfirmDeleteDialog(true);
  }

  function handleCloseConfirmDelete() {
    setConfirmDeleteDialog(false);
  }

  function handleAddMember() {
    console.log("add member");
  }

  function handleDeleteMember() {
    console.log("delete member");
    handleCloseConfirmDelete();
  }

  function handleRemoveMember(id) {
    console.log("remove", id);
  }
  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        borderRight={"1px solid gray"}
        sm={4}
      >
        <GroupsList myGroup={chatSample} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              top: "2rem",
              right: "2rem",
              position: "fixed",
              display: {
                xs: "block",
                sm: "none",
              },
            }}
          >
            <IconBtn title={"menu"} icon={<Menu />} onClick={handleMobile} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              borderRadius: "50%",
              top: "2rem",
              left: "2rem",
              bgcolor: `${btnBg}`,
              color: "white",
              ":hover": {
                bgcolor: `${btnBgLight}`,
              },
            }}
          >
            <IconBtn
              title={"back"}
              icon={<KeyboardBackspace />}
              onClick={handleNavigateBack}
            />
          </Box>
        </Box>

        {groupName && (
          <div>
            <Stack
              direction={"row"}
              spacing={"1rem"}
              justifyContent={"center"}
              alignItems={"center"}
              marginTop={"4rem"}
              padding={"1rem"}
            >
              {isEdit ? (
                <>
                  <TextField
                    value={groupNameUpdated}
                    onChange={(e) => setGroupNameUpdated(e.target.value)}
                  />
                  <IconBtn
                    title={"Done"}
                    icon={<Done />}
                    onClick={handleUpdateGroupName}
                  />
                </>
              ) : (
                <Stack direction={"row"} spacing={1}>
                  <Typography variant="h4">{groupName}</Typography>
                  <IconBtn
                    title={"Edit"}
                    icon={<Edit />}
                    onClick={() => setIsEdit(true)}
                  />
                </Stack>
              )}
            </Stack>

            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
              padding={{
                xs: "0",
                sm: "1rem",
                md: "1rem 4rem",
              }}
            >
              {sampleUsers.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  isAdded
                  styling={{
                    borderRadius: "0.5rem",
                  }}
                  handler={handleRemoveMember}
                />
              ))}
            </Stack>
            <Stack
              spacing={"1rem"}
              direction={{
                sm: "row",
              }}
              p={{
                xs: "0",
                sm: "1rem",
                md: "1rem 4rem",
              }}
            >
              <Button
                size="large"
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddMember}
              >
                Add Member
              </Button>
              <Button
                color="error"
                variant="outlined"
                size="large"
                startIcon={<Delete />}
                onClick={handleOpenConfirmDelete}
              >
                Delete Group
              </Button>
            </Stack>
          </div>
        )}
      </Grid>
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={handleCloseConfirmDelete}
            deleteHandle={handleDeleteMember}
          />
        </Suspense>
      )}

      <Drawer
        sx={{ display: { xs: "block", sm: "none" } }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <GroupsList w={"50vw"} myGroup={chatSample} chatId={chatId} />
      </Drawer>
    </Grid>
  );
}

export default GroupPage;
