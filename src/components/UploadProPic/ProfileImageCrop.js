import React, { createRef } from "react";
import Button from "@mui/material/Button";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { IoCloseSharp } from "react-icons/io5";

const ProfileImageCrop = ({
  image,
  setImage,
  cropData,
  setCropData,
  cropperRef,
  getCropData,
}) => {
  return (
    <>
      <div className="cropper">
        <div className="crop_head">
          <h4>Crope Your Profile</h4>
          <div className="crop_close" onClick={() => setImage()}>
            <IoCloseSharp />
          </div>
        </div>
        <div className="crop_preview">
          <div className="img-preview" />
        </div>
        <div className="crop_body">
          <div className="crop_image">
            <Cropper
              ref={cropperRef}
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              guides={true}
            />
          </div>
        </div>
        <div className="img_upload">
          <Button variant="contained" onClick={getCropData}>
            Upload
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileImageCrop;
