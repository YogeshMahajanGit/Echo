import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsFile, setUploadingLoader } from "../../redux/reducers/misc";
import { AudioFile, Image, UploadFile, VideoFile } from "@mui/icons-material";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

function FileMenu({ anchorEl, chatId }) {
  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();
  const { isFileMenu } = useSelector((state) => state.misc);

  const handleFileClose = () => dispatch(setIsFile(false));

  const selectRef = (ref) => {
    ref.current.click();
  };

  async function handleFileChange(e, key) {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 3) {
      return toast.error("You can only send 3 files at a time");
    }

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}...`);
    handleFileClose();

    // fetch upload
    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      if (res.data) {
        return toast.success(`${key} sent successfully`, {
          id: toastId,
        });
      } else {
        toast.error(`Failed to sent ${key}`, {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  }

  return (
    <Menu anchorEl={anchorEl} open={isFileMenu} onClose={handleFileClose}>
      <div
        style={{
          width: "8rem",
        }}
      >
        <MenuList>
          <MenuItem onClick={() => selectRef(imageRef.current?.click())}>
            <Tooltip title="Image">
              <Image />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem onClick={() => selectRef(audioRef.current?.click())}>
            <Tooltip title="Audio">
              <AudioFile />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>

          <MenuItem onClick={() => selectRef(videoRef.current?.click())}>
            <Tooltip title="Video">
              <VideoFile />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>

          <MenuItem onClick={() => selectRef(fileRef.current?.click())}>
            <Tooltip title="File">
              <UploadFile />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
}

export default FileMenu;
