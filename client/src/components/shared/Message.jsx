import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { boxShadow, orange } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";

function Message({ message, user }) {
  const { sender, content, attachments = [], createAt } = message;

  const sameSender = sender?._id == user?._id;

  const timeAgo = moment(createAt).fromNow();
  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? `${orange}` : "white",
        color: sameSender ? "white" : "black",
        borderRadius: sameSender ? "20px 20px 0px 20px" : "0px 20px 20px 20px",
        padding: "0.5rem",
        width: "fit-content",
        boxShadow: `${boxShadow}`,
      }}
    >
      {!sameSender && (
        <Typography variant="caption" color="textDisabled" fontWeight={600}>
          {sender.name}
        </Typography>
      )}

      {content && <Typography>{content}</Typography>}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const { url } = attachment;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                download={true}
                style={{ color: "black" }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}
      <Typography variant="caption" color={"textSecondary"}>
        {timeAgo}
      </Typography>
    </div>
  );
}

export default memo(Message);
