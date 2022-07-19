import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { handleDeleteClaim, handleDeleteReview } from '../../util/handlers';

export default function DeleteEntryInterface(props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="outlined" color="error" onClick={handleClickOpen}>
        {`Delete ${props.type}`}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete entry?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this entry? Associated reviews and
            sources will also be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant='contained'
            onClick={async () => {
              let deletedEntry = null;
              if (props.type === 'claim') {
                deletedEntry = await handleDeleteClaim(props.id);
              } else if (props.type === 'review') {
                deletedEntry = await handleDeleteReview(props.id);
              }
              if (deletedEntry) {
                router.push('/database').catch(() => {});
                handleClose();
              }

              handleClose();
            }}
          >
            Delete
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
