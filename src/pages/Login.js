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
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { activeUser } from "../slices/userSlice";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Login = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  let dispatch = useDispatch();
  let [show, setShow] = useState(false);
  let [loader, setLoader] = useState(false);
  let [formData, setFormData] = useState({
    email: "",
    password: "",
    fgp: "",
  });

  let [error, setError] = useState({
    email: "",
    password: "",
    fgp: "",
  });

  let handleGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {});
  };

  let handleFgp = () => {
    sendPasswordResetEmail(auth, formData.fgp)
      .then(() => {
        toast("email sent, please check your email");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode.includes("auth/user-not-found")) {
          setError({ ...error, fgp: "user not found" });
        }

        console.log(errorCode);
        console.log(errorMessage);
      });
  };

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
          dispatch(activeUser(userCredential.user));
          localStorage.setItem("userInfo", JSON.stringify(userCredential.user));
          if (userCredential.user.emailVerified) {
            toast("Successfully login");
            setTimeout(() => {
              setLoader(false);
              navigate("/pechal");
            }, 2000);
          } else {
            setLoader(false);
            toast("varify your email and try again");
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode.includes("auth/user-not-found")) {
            setLoader(false);
            setError({ ...error, email: "user Not found" });
          }
          if (errorMessage.includes("auth/wrong-password")) {
            setLoader(false);
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
                <img
                  onClick={handleGoogle}
                  style={{ marginTop: "30px" }}
                  src="assets/google.png"
                />
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
                    title="Loading..."
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
                <Button onClick={handleOpen}>Forgot Password?</Button>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <img className="regimg" src="assets/loginimg.png" />
        </Grid>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Forgot Password ?
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <InputBox
                  name="fgp"
                  textChange={handleLogin}
                  className="reginput"
                  label="Email"
                  variant="standard"
                  type="email"
                />
                {error.fgp && (
                  <Alert className="error" variant="outlined" severity="error">
                    {error.fgp}
                  </Alert>
                )}
                <PButton
                  click={handleFgp}
                  title="Send Email"
                  bname={CommonButton}
                />
              </Typography>
            </Box>
          </Modal>
        </div>
      </Grid>
    </>
  );
};

export default Login;
