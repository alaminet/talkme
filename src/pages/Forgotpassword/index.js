import { Container } from "@mui/system";
import TextField from "@mui/material/TextField";
import React from "react";
import "./style.css";
import { Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
export const Forgotpassword = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  // Formik Area
  const initialValues = {
    userEmail: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => {
      sendPasswordResetEmail(auth, formik.values.userEmail)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          if (error.code.includes("auth/user-not-found")) {
            toast.error("Invalid Email", {
              position: "bottom-center",
              autoClose: 1000,
              theme: "light",
              pauseOnHover: false,
            });
          }
        });
    },
  });
  return (
    <>
      <Container>
        <ToastContainer />
        <Grid
          container
          height="100vh"
          justifyContent="center"
          alignItems="center">
          <Grid item xs={6}>
            <div className="forgotpassBox">
              <h2>Reset Your Password</h2>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  type="email"
                  label="Email"
                  variant="outlined"
                  name="userEmail"
                  value={formik.values.userEmail}
                  onChange={formik.handleChange}
                />
                <Button variant="contained" type="submit">
                  Reset
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Forgotpassword;
