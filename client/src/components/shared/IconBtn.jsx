import { Badge, IconButton, Tooltip } from "@mui/material";

function IconBtn({ title, icon, onClick, value }) {
  return (
    <Tooltip title={title}>
      <IconButton size="large" color="inherit" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
}

export default IconBtn;
