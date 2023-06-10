import React, { useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { Container } from "@mui/system";
import { Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import BeatLoader from "react-spinners/BeatLoader";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { logIn } from "../../validation/Validation";
import { useDispatch } from "react-redux";
import { Loginuser } from "../../features/Slice/UserSlice";
import "./style.css";
import { getDatabase, ref, set } from "firebase/database";

const Login = () => {
  const db = getDatabase();
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [eyeshow, setEyeshow] = useState("password");
  const handleEye = () => {
    if (eyeshow === "password") {
      setEyeshow("text");
    } else {
      setEyeshow("password");
    }
  };

  //   Formik Area

  const initialValues = {
    userEmail: "",
    userPass: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: logIn,
    onSubmit: () => {
      setLoading(true);
      signInWithEmailAndPassword(
        auth,
        formik.values.userEmail,
        formik.values.userPass
      )
        .then(({ user }) => {
          formik.resetForm();
          setLoading(false);
          navigate("/");
          if (auth.currentUser.emailVerified === true) {
            dispatch(Loginuser(user));
            localStorage.setItem("users", JSON.stringify(user));
            set(ref(db, "online/" + user.uid), {
              username: user.displayName,
            });
          } else {
            toast.warn("Please verify your Email", {
              position: "bottom-center",
              autoClose: 1000,
              pauseOnHover: false,
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.code.includes("auth/user-not-found")) {
            toast.error("Invalid Email", {
              position: "bottom-center",
              autoClose: 1000,
              theme: "light",
              pauseOnHover: false,
            });
          } else if (error.code.includes("auth/wrong-password")) {
            toast.error("Invalid Password", {
              position: "bottom-center",
              autoClose: 1000,
              theme: "light",
              pauseOnHover: false,
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

  // Google auth
  const googleprovider = new GoogleAuthProvider();
  const handleauthGoogle = () => {
    signInWithPopup(auth, googleprovider).then(({ user }) => {
      dispatch(Loginuser(user));
      localStorage.setItem("users", JSON.stringify(user));
      navigate("/");
    });
  };

  // Facebook auth
  const facebookprovider = new FacebookAuthProvider();
  const handleauthFacebook = () => {
    signInWithPopup(auth, facebookprovider).then(({ user }) => {
      dispatch(Loginuser(user));
      localStorage.setItem("users", JSON.stringify(user));
      navigate("/");
    });
  };
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
          <Grid item xs={6} className="loginLeft">
            <div>
              <picture>
                <img
                  className="sign_up_pic"
                  src="./images/tablet_login.gif"
                  alt="login"
                />
              </picture>
            </div>
          </Grid>
          <Grid item xs={6} className="loginRight">
            <div className="loginArea">
              <div className="loginHead">
                <picture>
                  <img src="./images/avatar_boy_cap.png" alt="" />
                </picture>
              </div>
              <h1>Login to your account!</h1>
              <div className="authLogin">
                <div>
                  <Button
                    variant="outlined"
                    startIcon={<FcGoogle />}
                    onClick={handleauthGoogle}>
                    Google
                  </Button>
                </div>
                <div>
                  <Button
                    variant="outlined"
                    startIcon={<FaFacebook />}
                    onClick={handleauthFacebook}>
                    Facebook
                  </Button>
                </div>
                <div>
                  <Button variant="outlined" startIcon={<FaGithub />}>
                    Github
                  </Button>
                </div>
              </div>
              <form className="loginFrom" onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  type="email"
                  label="Email"
                  variant="outlined"
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
                    variant="outlined"
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
                {loading ? (
                  <button
                    disabled
                    className="btn-round btn-sign-up"
                    type="submit">
                    <BeatLoader color="#fff" />
                  </button>
                ) : (
                  <button className="btn-round btn-sign-up" type="submit">
                    Login
                  </button>
                )}

                <p className="registrationOption">
                  You have no account? <Link to="/registration">Sign Up</Link>
                </p>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Login;
