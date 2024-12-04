/* eslint-disable react/prop-types */
import { Avatar, Stack, Typography } from "@mui/material";
import {
  AlternateEmail as UsernameIcon,
  CalendarMonth,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import moment from "moment";
import { transformImage } from "../../lib/features";

function Profile({ user }) {
  return (
    <Stack alignItems={"center"} spacing={"2rem"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard
        heading={"username"}
        text={user?.username}
        Icon={<UsernameIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={user?.name}
        Icon={<AccountCircleIcon />}
      />
      <ProfileCard
        heading={"Joined"}
        text={moment(user.createdAt).fromNow()}
        Icon={<CalendarMonth />}
      />
    </Stack>
  );
}

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"gray"}
    textAlign={"center"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography variant="caption" color="gray">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
