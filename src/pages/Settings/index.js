import React, { useState } from "react";
import "./style.css";
import Card from "@mui/material/Card";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import Profilemodal from "../../components/Modals/Profilemodal";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";
import { Loginuser } from "../../features/Slice/UserSlice";

const Settings = () => {
  const db = getDatabase();
  const auth = getAuth();
  const dispatch = useDispatch();
  const users = useSelector((user) => user.loginSlice.login);
  const defaultProfile = "./images/avatar_boy_cap.png";

  // ProfileModal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // Formik area
  const initialValues = {
    userName: "",
    userPass: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => {
      update(ref(db, "users/" + users.uid), {
        username: formik.values.userName,
      })
        .then(() => {
          dispatch(
            Loginuser({ ...users, displayName: formik.values.userName })
          );
          localStorage.setItem(
            "users",
            JSON.stringify({ ...users, displayName: formik.values.userName })
          );
          updateProfile(auth.currentUser, {
            displayName: formik.values.userName,
          }).then(() => {
            console.log(users);
          });
        })
        .catch((error) => {
          console.log(error.code);
        });
    },
  });

  return (
    <>
      <div className="setting-card">
        <Card sx={{ maxWidth: 275 }}>
          <div className="profile-pic" onClick={handleOpen}>
            <picture>
              <img
                src={users?.photoURL ?? defaultProfile}
                alt={users?.displayName}
              />
            </picture>
            <div className="profile_overlay">
              <FaCloudUploadAlt />
            </div>
          </div>
          <div className="user-info">
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                type="text"
                margin="normal"
                label={users?.displayName}
                variant="standard"
                name="userName"
                value={formik.values.userName}
                onChange={formik.handleChange}
                helperText={
                  formik.errors.userName && formik.touched.userName
                    ? formik.errors.userName
                    : null
                }
              />
              <TextField
                fullWidth
                disabled
                type="email"
                margin="normal"
                label={users?.email}
                variant="standard"
                name="userEmail"
                value={formik.values.userEmail}
                onChange={formik.handleChange}
                helperText={
                  formik.errors.userEmail && formik.touched.userEmail
                    ? formik.errors.userEmail
                    : null
                }
              />
              <TextField
                fullWidth
                type="password"
                margin="normal"
                label="Password"
                variant="standard"
                name="userPass"
                value={formik.values.userPass}
                onChange={formik.handleChange}
                helperText={
                  formik.errors.userPass && formik.touched.userPass
                    ? formik.errors.userPass
                    : null
                }
              />
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </form>
          </div>
        </Card>
      </div>
      <Profilemodal open={open} setOpen={setOpen} />
    </>
  );
};

export default Settings;
