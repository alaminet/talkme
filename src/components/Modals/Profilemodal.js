import React from "react";
import "./style.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import UploadProPic from "../UploadProPic";

const Profilemodal = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="box_modal">
          <UploadProPic setOpen={setOpen} />
        </Box>
      </Modal>
    </>
  );
};

export default Profilemodal;
