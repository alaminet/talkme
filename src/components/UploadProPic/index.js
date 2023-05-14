import React, { createRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { BiImageAdd } from "react-icons/bi";
import "./style.css";
import { useRef } from "react";
import ProfileImageCrop from "./ProfileImageCrop";
import { useDispatch, useSelector } from "react-redux";
import { Loginuser } from "../../features/Slice/UserSlice";
import { getDatabase, push, set, update } from "firebase/database";

const UploadProPic = ({ setOpen }) => {
  // User
  const user = useSelector((user) => user.loginSlice.login);
  const dispatch = useDispatch();

  // firebase
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  const storageRef = ref(storage, "userpic/" + user.uid);

  // State
  const chooseFile = useRef(null);
  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();
  const handleUploadProPic = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      const uploadimg = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(storageRef, uploadimg, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              setOpen(false);
              dispatch(Loginuser({ ...user, photoURL: downloadURL }));
              localStorage.setItem(
                "users",
                JSON.stringify({ ...user, photoURL: downloadURL })
              );
            })
            .catch((error) => {
              console.log(error);
            });
        });
      });
    }
  };
  return (
    <>
      <div className="pre_upload">
        <div
          className="upload_content"
          onClick={() => chooseFile.current.click()}>
          <input
            type="file"
            hidden
            ref={chooseFile}
            onChange={handleUploadProPic}
          />
          <BiImageAdd />
          <h4>Upload Image</h4>
        </div>
        {image && (
          <div className="crope_img">
            <ProfileImageCrop
              image={image}
              setImage={setImage}
              cropData={cropData}
              setCropData={setCropData}
              cropperRef={cropperRef}
              getCropData={getCropData}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UploadProPic;
