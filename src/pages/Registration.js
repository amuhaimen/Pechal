import React, { useState } from "react";
import Header from "../components/Header";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import Grid from "@mui/material/Grid";
import PButton from "../components/PButton";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import AuthenticationLink from "../components/AuthenticationLink";
import Alert from "@mui/material/Alert";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommonButton = styled(Button)({
  width: "100%",
  borderRadius: "86px",
  padding: "19px",
  marginTop: "51.86px",
  fontSize: "20.64px",
  fontFamily: "Nunito",
  backgroundColor: "#5F35F5",
  boxShadow: "none",
  textTransform: "none",
  lineHeight: 1.5,
  "&:hover": {
    backgroundColor: "#0069d9",
  },
});

const Registration = () => {
  let navigate = useNavigate();
  const auth = getAuth();
  let [show, setShow] = useState(false);
  let [loader, setLoader] = useState(false);
  let [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  let [error, setError] = useState({
    email: "",
    name: "",
    password: "",
  });

  let handleClick = () => {
    setLoader(true);
    let expression =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (formData.email == "") {
      setLoader(false);
      setError({ ...error, email: "Email Required" });
    } else if (!expression.test(formData.email)) {
      setLoader(false);
      setError({ ...error, email: "valid email required" });
    } else if (formData.name == "") {
      setLoader(false);
      setError({ ...error, name: "Full Name Required" });
    } else if (formData.password == "") {
      setLoader(false);
      setError({ ...error, password: "Passwosrd Required" });
    } else {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then(() => {
          sendEmailVerification(auth.currentUser).then(() => {
            toast("Registration Successful, please check yousr email");
            setTimeout(() => {
              setLoader(false);
              navigate("/login");
            }, 2000);
          });
        })
        .catch((e) => {
          const errorCode = e.code;
          // const errorMessage = error.message;

          if (errorCode.includes("auth/email-already-in-use")) {
            setError({ ...error, email: "Email Already Exists" });
          }
        });
    }
  };

  let handleForm = (e) => {
    let { name, value } = e.target;
    if (name == "password") {
      let capi = /[A-Z]/;
      let lower = /[a-z]/;
      let num = /[0-9]/;
      if (!capi.test(value)) {
        setError({ ...error, password: "one capital latter required" });
        return;
      }
      if (!lower.test(value)) {
        setError({ ...error, password: "one lower latter required" });
        return;
      }
      if (!num.test(value)) {
        setError({ ...error, password: "one number required" });
        return;
      }
      if (value.length < 8) {
        setError({ ...error, password: "password length at least 8" });
        return;
      }
      if (value === "") {
        setError("");
        return;
      }
      //PROBLEM:value remove korle error theke jay
    }

    setFormData({ ...formData, [name]: value });

    setError({ ...error, [name]: "" });
    //=============================
    //Or
    // if (e.target.name == "email") {
    //   setFormData({ ...formData, email: e.target.value });
    //   console.log(formData);
    // } else if (e.target.name == "name") {
    //   setFormData({ ...formData, name: e.target.value });
    //   console.log(formData);
    // } else {
    //   setFormData({ ...formData, password: e.target.value });
    //   console.log(formData);
    // }
    //Note:but uporer ta hocche nichertar shortcut version
  };

  return (
    <>
      <Grid container spacing={2}>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Grid item xs={6}>
          <div className="regleftside">
            <div>
              <Header>
                <Heading
                  className="heading"
                  title="Get started with easily register"
                  as="h2"
                />
                <p className="regsubheading">
                  Free register and you can enjoy it
                </p>
              </Header>
              <div className="inputboxcontainer">
                <InputBox
                  name="email"
                  textChange={handleForm}
                  type="email"
                  className="reginput"
                  label="Email"
                  variant="outlined"
                />
                {error.email && (
                  <Alert className="error" variant="outlined" severity="error">
                    {error.email}
                  </Alert>
                )}

                <InputBox
                  name="name"
                  textChange={handleForm}
                  type="text"
                  className="reginput"
                  label="Full Name"
                  variant="outlined"
                />
                {error.name && (
                  <Alert className="error" variant="outlined" severity="error">
                    {error.name}
                  </Alert>
                )}
                <div style={{ width: "100%", position: "relative" }}>
                  <InputBox
                    name="password"
                    textChange={handleForm}
                    type={show ? "text" : "password"}
                    className="reginput"
                    label="Password"
                    variant="outlined"
                  />
                  {show ? (
                    <AiFillEye
                      className="eyeicon"
                      onClick={() => setShow(false)}
                    />
                  ) : (
                    <AiFillEyeInvisible
                      className="eyeicon"
                      onClick={() => setShow(true)}
                    />
                  )}
                </div>

                {error.password && (
                  <Alert className="error" variant="outlined" severity="error">
                    {error.password}
                  </Alert>
                )}
                {loader ? (
                  <PButton
                    className="loadingbutton"
                    title="Loading..."
                    bname={CommonButton}
                  />
                ) : (
                  <PButton
                    click={handleClick}
                    title="Sign Up"
                    bname={CommonButton}
                  />
                )}

                <AuthenticationLink
                  className="reglink"
                  title="Already have an account ?"
                  href="/login"
                  hreftitle="Sign in"
                />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <img className="regimg" src="assets/regimg.png" />
        </Grid>
      </Grid>
    </>
  );
};

export default Registration;
