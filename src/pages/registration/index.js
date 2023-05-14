import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import BeatLoader from "react-spinners/BeatLoader";
import "./style.css";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signUp } from "../../validation/Validation";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const db = getDatabase();
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eyeshow, setEyeshow] = useState("password");
  const handleEye = () => {
    if (eyeshow === "password") {
      setEyeshow("text");
    } else {
      setEyeshow("password");
    }
  };

  // Formik area
  const initialValues = {
    userName: "",
    userEmail: "",
    userPass: "",
    confPass: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUp,
    onSubmit: () => {
      setLoading(true);
      createUserWithEmailAndPassword(
        auth,
        formik.values.userEmail,
        formik.values.userPass
      )
        .then(({ user }) => {
          updateProfile(auth.currentUser, {
            displayName: formik.values.userName,
          }).then(() => {
            sendEmailVerification(auth.currentUser).then(() => {
              set(ref(db, "users/" + user.uid), {
                username: user.displayName,
                email: user.email,
              });
            });
          });
        })
        .then(() => {
          formik.resetForm();
          setLoading(false);
          toast.success("Please verify your Email..!", {
            position: "bottom-center",
            autoClose: 1000,
            pauseOnHover: false,
            theme: "light",
          });
        })
        .then(() => {
          setTimeout(() => {
            navigate("/");
          }, 6500);
        })
        .catch((error) => {
          setLoading(false);
          if (error.code.includes("auth/email-already-in-use")) {
            toast.error("Email already in used!", {
              position: "bottom-center",
              autoClose: 1000,
              pauseOnHover: false,
              theme: "light",
            });
          } else if (error.code.includes("auth/network-request-failed")) {
            toast.warn("Check Your Internet Connection", {
              position: "bottom-center",
              autoClose: 1000,
              pauseOnHover: false,
            });
          } else {
            formik.resetForm();
          }
        });
    },
  });
  return (
    <>
      <Container fixed>
        <ToastContainer />
        <Grid
          height="100vh"
          container
          spacing={2}
          justifyContent="center"
          alignItems="center">
          <Grid className="registrationLeft" item xs={6}>
            <h3>Get started with easily register</h3>
            <h6>Free register and you can enjoy it</h6>
            <form onSubmit={formik.handleSubmit} className="registrationForm">
              <TextField
                fullWidth
                margin="normal"
                type="text"
                label="Username"
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
                margin="normal"
                type="email"
                label="Email"
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
              <div className="passShow">
                <TextField
                  fullWidth
                  margin="normal"
                  type={eyeshow}
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
                <div className="eyes" onClick={handleEye}>
                  {eyeshow === "password" ? (
                    <AiOutlineEye />
                  ) : (
                    <AiOutlineEyeInvisible />
                  )}
                </div>
              </div>
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Confirm Password"
                variant="standard"
                name="confPass"
                value={formik.values.confPass}
                onChange={formik.handleChange}
                helperText={
                  formik.errors.confPass && formik.touched.confPass
                    ? formik.errors.confPass
                    : null
                }
              />
              {loading ? (
                <button
                  disabled
                  className="btn-round btn-sign-up"
                  type="submit">
                  <BeatLoader color="#fff" />
                </button>
              ) : (
                <button className="btn-round btn-sign-up" type="submit">
                  Sing Up
                </button>
              )}

              <p className="registrationOption">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </Grid>
          <Grid item xs={6}>
            <div>
              <picture>
                <img
                  className="sign_up_pic"
                  src="./images/Sign_up.gif"
                  alt="sign_up"
                />
              </picture>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Registration;
