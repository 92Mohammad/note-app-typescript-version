import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import rmeoveTab, {RequestParameter, AlertBoxProps } from "../utils";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props}  />;
});

export default function AlertDialogSlide({noteId, title, notes, setNotes, setIsOpenAlertBox, tabs, setTabs}: AlertBoxProps) {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setIsOpenAlertBox(false);
    };


    const deleteNote = async () => {
        try {
            const deleteNoteParameter: RequestParameter = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("jwtToken")!
                },
                body: JSON.stringify({
                    noteId: noteId,
                    title: title,
                })
            }
            const response = await fetch("http://localhost:8000/note/deleteNote", deleteNoteParameter);

            if (response.status === 201) {
                // here change the notes state so that react re-render the Note component
                setNotes(notes.filter((note) => note._id !== noteId));
                setOpen(false)
                // also set the window tab state to new state so that remaining tab should be displayed
                rmeoveTab(tabs, setTabs, noteId);
                

            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <React.Fragment>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Do you want to delete the note"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        On deleting notes it will leads to delete your note content
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => deleteNote() }>Yes</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}