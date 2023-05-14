import React, { useState } from "react";
import "./style.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import { getDatabase, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";

const Groupmodal = ({ open, setOpen }) => {
  const db = getDatabase();
  const handleClose = () => setOpen(false);
  const [groupname, setGroupname] = useState();
  const [grouptag, setgrouptag] = useState();
  const users = useSelector((user) => user.loginSlice.login);

  //   Create new group
  const handleCreate = () => {
    set(push(ref(db, "groups")), {
      groupName: groupname,
      groupTag: grouptag,
      groupAdmin: users.uid,
    }).then(() => {
      setOpen(false);
      toast.success(groupname + " Created...!", {
        position: "bottom-center",
        autoClose: 1000,
        pauseOnHover: false,
        theme: "light",
      });
    });
  };

  return (
    <>
      <ToastContainer />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="box_modal">
          <div>
            <div className="box_title">
              <h3>Create New Group</h3>
            </div>
            <div className="group_inputs">
              <TextField
                fullWidth
                label="Group Name"
                variant="outlined"
                margin="normal"
                onChange={(e) => setGroupname(e.target.value)}
              />
              <TextField
                fullWidth
                label="Group Tagline"
                variant="outlined"
                margin="normal"
                onChange={(e) => setgrouptag(e.target.value)}
              />
              <Button
                type="submit"
                className="primary_btn"
                variant="contained"
                size="small"
                onClick={() => handleCreate()}>
                Create
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Groupmodal;
