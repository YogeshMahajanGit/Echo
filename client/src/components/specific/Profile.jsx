import { Avatar, Stack, Typography } from "@mui/material";
import {
  AlternateEmail as UsernameIcon,
  CalendarMonth,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import moment from "moment";

function Profile() {
  return (
    <Stack alignItems={"center"} spacing={"2rem"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={"hhg cdrty bgtresdf jytfg"} />
      <ProfileCard
        heading={"username"}
        text={"mahajan"}
        Icon={<UsernameIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={"Yogesh dilip mahajan"}
        Icon={<AccountCircleIcon />}
      />
      <ProfileCard
        heading={"Joined"}
        text={moment("2023-08-10T18:30:00.000Z").fromNow()}
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
