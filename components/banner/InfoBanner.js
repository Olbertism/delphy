import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Link from 'next/link';

export default function InfoBanner(props) {
  return (
    <Dialog
      open={!props.bannerAccepted}
      onClose={props.infoBannerHandler}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description1"
    >
      <DialogTitle id="alert-dialog-title">Welcome to Delphy!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description1">
          Please read the <Link href="/about">About</Link> page.
        </DialogContentText>
        <DialogContentText id="alert-dialog-description2">
          <strong>IMPORTANT!</strong>
        </DialogContentText>
        <DialogContentText id="alert-dialog-description3">
          The search and evaluation functions are subject to request limits!
          Please do not spam requests! Thanks!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.infoBannerHandler}>Duly noted</Button>
      </DialogActions>
    </Dialog>
  );
}
