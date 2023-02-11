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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CommonButton = styled(Button)({
  width: "100%",
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

const Login = () => {
  let navigate = useNavigate();
  const auth = getAuth();
  let [show, setShow] = useState(false);
  let [loader, setLoader] = useState(false);
  let [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  let [error, setError] = useState({
    email: "",
    password: "",
  });

  let handleClick = () => {
    setLoader(true);
    let expression =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (formData.email == "") {
      setLoader(false);
      setError({ ...error, email: "email required" });
    } else if (!expression.test(formData.email)) {
      setLoader(false);
      setError({ ...error, email: "valid email required" });
    } else if (formData.password == "") {
      setLoader(false);
      setError({ ...error, password: "password required" });
    } else {
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          console.log(userCredential);
          if (userCredential.user.emailVerified) {
            navigate("/home");
          } else {
            setLoader(false);
            toast("varify your email and try again");
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode.includes("auth/user-not-found")) {
            setError({ ...error, email: "user Not found" });
          }
          if (errorMessage.includes("auth/wrong-password")) {
            setError({ ...error, password: "wrong password ,try again" });
          }
        });
    }
  };

  let handleLogin = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: "" });
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
          <div className="loginleftside">
            <div>
              <Header>
                <Heading
                  className="heading"
                  title="Login to your account"
                  as="h2"
                />
                <img style={{ marginTop: "30px" }} src="assets/google.png" />
              </Header>
              <div className="inputboxcontainer">
                <InputBox
                  name="email"
                  textChange={handleLogin}
                  className="reginput"
                  label="Email"
                  variant="standard"
                  type="email"
                />
                {error.email && (
                  <Alert className="error" variant="outlined" severity="error">
                    {error.email}
                  </Alert>
                )}
                <div style={{ width: "100%", position: "relative" }}>
                  <InputBox
                    name="password"
                    textChange={handleLogin}
                    className="logininput"
                    label="Password"
                    variant="standard"
                    type={show ? "text" : "password"}
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
                    title="Loading"
                    bname={CommonButton}
                  />
                ) : (
                  <PButton
                    click={handleClick}
                    title="Continue to google"
                    bname={CommonButton}
                  />
                )}

                <AuthenticationLink
                  className="reglink"
                  title="Don’t have an account ? Sign up"
                  href="/"
                  hreftitle=" Sign up"
                />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <img className="regimg" src="assets/loginimg.png" />
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
