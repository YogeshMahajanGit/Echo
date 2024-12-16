import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function ConfirmDeleteDialog({ open, handleClose, deleteHandle }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this group?
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={deleteHandle} color="error" variant="outlined">
            Yes
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;
