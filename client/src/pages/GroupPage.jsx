import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
import { btnBg, btnBgLight } from "../constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconBtn from "../components/shared/IconBtn";
import { lazy, Suspense, useEffect, useState } from "react";
import GroupsList from "../components/specific/GroupsList";
import UserItem from "../components/shared/UserItem";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/Hook";
import LoadingGrid from "../components/shared/LoadingGrid";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

function GroupPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdated, setGroupNameUpdated] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  // fetch groups query
  const myGroups = useMyGroupsQuery("");

  const groupsDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, renameIsLoading] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, removeIsLoading] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );
  const [deleteGroup, deleteGroupIsLoading] = useAsyncMutation(
    useDeleteChatMutation
  );
  // handle error
  const errors = [
    {
      isError: myGroups.isError,
      errors: myGroups.error,
    },
    {
      isError: groupsDetails.isError,
      errors: groupsDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    if (groupsDetails.data) {
      setGroupName(groupsDetails.data.chat.name);
      setGroupNameUpdated(groupsDetails.data.chat.name);
      setMembers(groupsDetails.data.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupsDetails.data]);

  useEffect(() => {
    if (chatId) {
      setGroupName(groupName);
      setGroupNameUpdated(groupName);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setIsEdit(false);
    };
  }, [chatId]);

  // handlers
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
    updateGroup("Updating...", { chatId, name: groupNameUpdated });
  }

  function handleOpenConfirmDelete() {
    setConfirmDeleteDialog(true);
  }

  function handleCloseConfirmDelete() {
    setConfirmDeleteDialog(false);
  }

  function handleAddMember() {
    dispatch(setIsAddMember(true));
  }

  function handleDeleteMember() {
    deleteGroup("Deleting...", chatId);
    handleCloseConfirmDelete();
    navigate("/groups");
  }

  function handleRemoveMember(userId) {
    removeMember("Removing member...", { userId, chatId });
  }

  return myGroups.isLoading ? (
    <LoadingGrid />
  ) : (
    <Grid
      container
      height={"100vh"}
    >
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
        <GroupsList
          myGroup={myGroups?.data?.groups}
          chatId={chatId}
        />
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
            <IconBtn
              title={"menu"}
              icon={<Menu />}
              onClick={handleMobile}
            />
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
                    disabled={renameIsLoading}
                  />
                </>
              ) : (
                <Stack
                  border={"1px solid gray"}
                  direction={"row"}
                  padding={"0.6rem"}
                  borderRadius={"10px"}
                  spacing={1}
                  textAlign={"center"}
                >
                  <Typography
                    variant="h4"
                    fontWeight={"600"}
                  >
                    {groupName}
                  </Typography>
                  <IconBtn
                    title={"Edit"}
                    icon={<Edit />}
                    disabled={renameIsLoading}
                    onClick={() => setIsEdit(true)}
                  />
                </Stack>
              )}
            </Stack>

            <Typography
              margin={"1rem"}
              alignSelf={"flex-start"}
              variant="h5"
              fontWeight={"600"}
            >
              Members :
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              spacing={"1rem"}
              maxHeight={"50vh"}
              marginBottom={"25px"}
              overflow={"auto"}
              padding={{
                xs: "0.6rem",
                sm: "1rem",
                md: "1rem 4rem",
              }}
            >
              {removeIsLoading ? (
                <CircularProgress />
              ) : (
                members.map((user) => (
                  <UserItem
                    key={user._id}
                    user={user}
                    isAdded
                    styling={{
                      borderRadius: "0.5rem",
                    }}
                    handler={handleRemoveMember}
                  />
                ))
              )}
            </Stack>
            <Stack
              spacing={"1rem"}
              gap={"1rem"}
              direction={{
                sm: "row",
              }}
              p={{
                xs: "0",
                sm: "1rem",
                md: "1rem 2rem",
              }}
            >
              <Button
                size="small"
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddMember}
              >
                Add Member
              </Button>
              <Button
                color="error"
                variant="outlined"
                size="small"
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
          <AddMemberDialog chatId={chatId} />
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
        <GroupsList
          w={"50vw"}
          myGroup={myGroups?.data?.groups}
          chatId={chatId}
        />
      </Drawer>
    </Grid>
  );
}

export default GroupPage;
