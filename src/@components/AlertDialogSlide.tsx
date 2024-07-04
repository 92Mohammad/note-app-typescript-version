import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { deleteNote, setIsOpenAlertBox } from "../features/NoteSlice";
import { RootState, useAppDispatch } from "../app/store";
import { useSelector } from "react-redux";


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const dispatch = useAppDispatch();
  const { deletedNoteInfo, isOpenAlertBox } = useSelector((state: RootState) => state.notes);

  React.useEffect(() => {   
    if (deletedNoteInfo.isDelete){
        dispatch(setIsOpenAlertBox(true));
    }

  }, [deletedNoteInfo])

  const handleClose = () => {
    dispatch(setIsOpenAlertBox(false));
  };

  return (

      <>
        <Dialog
            open={isOpenAlertBox}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Do you really want to delete?"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                Deleting notes will cause to delete your content.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => dispatch(deleteNote(deletedNoteInfo.id))}> Yes </Button>
            </DialogActions>
        </Dialog>  
      </>
  );
}
    