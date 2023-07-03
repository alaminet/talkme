import React from "react";
import "./style.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import UploadGroupPic from "../UploadGroupPic";

const Grouppicmodal = ({ open, setOpen, selectGrp }) => {
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="box_modal">
          <UploadGroupPic setOpen={setOpen} selectGrp={selectGrp} />
        </Box>
      </Modal>
    </>
  );
};

export default Grouppicmodal;
