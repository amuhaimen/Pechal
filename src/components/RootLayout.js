import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiTwotoneSetting,
  AiOutlineLogin,
} from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { borderRadius, width } from "@mui/system";
import { useDispatch } from "react-redux";
import { activeUser } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";

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

const RootLayout = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const auth = getAuth();                  
  let data = useSelector((state) => state);
  // console.log(data.userdata.userInfo);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //cropper start
  const [image, setImage] = useState();
  const [profile, setProfile] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  let handlehome = () => {
    navigate("/pechal");
  };
  let handlemessage = () => {
    navigate("message");
  };

  const onChange = (e) => {
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
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `profilepic/${data.userdata.userInfo.uid}`
      );
      //photo upload functionality start
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        console.log("Uploaded a data_url string!");
        setOpen(false);
        setImage("");
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then((user) => {
            dispatch(activeUser(auth.currentUser));
            localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
          });
        });
      });
    }
  };
  //cropper end

  useEffect(() => {
    setProfile(data.userdata.userInfo.photoURL);
  }, [data.userdata.userInfo.photoURL]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <div className="sidebarbox">
            <div className="sidebar">
              <div className="imgholder">
                {image ? (
                  <div className="img-preview"></div>
                ) : data.userdata.userInfo.photoURL ? (
                  <img
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                    }}
                    onClick={handleOpen}
                    src={profile}
                  />
                ) : (
                  <img onClick={handleOpen} src="assets/profilepic.png" />
                )}
              </div>
              <h3>{data.userdata.userInfo.displayName}</h3>
              <div className="iconholder">
                <AiOutlineHome onClick={handlehome} className="icon" />
                <AiOutlineMessage onClick={handlemessage} className="icon" />
                <IoMdNotificationsOutline className="icon" />
                <AiTwotoneSetting className="icon" />
                <AiOutlineLogin className="logouticon" />
              </div>
            </div>
          </div>
          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Upload Profile Picture
                </Typography>
                <div className="imgholder">
                  {image ? (
                    <div className="img-preview" />
                  ) : data.userdata.userInfo.photoURL ? (
                    <img
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: "50%",
                      }}
                      src={data.userdata.userInfo.photoURL}
                    />
                  ) : (
                    <img src="./assets/profilepic.png" />
                  )}
                </div>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <input onChange={onChange} type="file" />
                  {image && (
                    <>
                      {/* photo upload cropper*/}
                      <Cropper
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
                        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                        onInitialized={(instance) => {
                          setCropper(instance);
                        }}
                        guides={true}
                      />
                      <Button onClick={getCropData} variant="contained">
                        Upload Photo
                      </Button>
                    </>
                  )}
                </Typography>
              </Box>
            </Modal>
          </div>
        </Grid>

        <Outlet />
      </Grid>
    </>
  );
};

export default RootLayout;
