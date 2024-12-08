import { IconButton, Tooltip } from "@mui/material";

function IconBtn({ title, icon, onClick }) {
  return (
    <Tooltip title={title}>
      <IconButton size="large" color="inherit" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
}

export default IconBtn;
