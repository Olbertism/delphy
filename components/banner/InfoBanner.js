import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function InfoBanner(props) {
  return (
    <Dialog
      open={!props.bannerAccepted}
      onClose={props.infoBannerHandler}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Welcome to Delphy</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Soon you will find a nice disclaimer text here
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.infoBannerHandler}>Duly noted</Button>
      </DialogActions>
    </Dialog>
  );
}
