import * as Yup from "yup";

export const signUp = Yup.object({
  userName: Yup.string().min(4).max(15).required("Please enter your User Name"),
  userEmail: Yup.string().email().required("Please enter your Email"),
  userPass: Yup.string().min(5).max(15).required("Please enter your Password"),
  confPass: Yup.string()
    .oneOf([Yup.ref("userPass"), null], "Password Must Matched")
    .required("Confirm password must be required"),
});

export const logIn = Yup.object({
  userEmail: Yup.string().email().required("Please enter your Email"),
  userPass: Yup.string().min(5).max(15).required("Please enter your Password"),
});

export const updateProInfo = Yup.object({
  userName: Yup.string().min(4).max(15).required("Please enter your User Name"),
  userPass: Yup.string().min(5).max(15).required("Please enter your Password"),
});
