import React, { useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { activeUser } from "../slices/userSlice";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Grouplist from "../components/Grouplist";
import FriendRequest from "../components/FriendRequest";
import Friends from "../components/Friends";
import Mygroups from "../components/Mygroups";
import Userlist from "../components/Userlist";
import Blocklist from "../components/Blocklist";

const Home = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  let dispatch = useDispatch();

  let data = useSelector((state) => state);

  // console.log(data.userdata.userInfo);
  useEffect(() => {
    if (!data.userdata.userInfo) {
      navigate("/login");
    }
  }, []);

  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     console.log(user);
  //     dispatch(activeUser(user));
  //   } else {
  //     navigate("/login");
  //   }
  // });

  let handleLogOut = () => {
    localStorage.removeItem("userInfo");
    dispatch(activeUser(null));
    signOut(auth).then(() => {
      navigate("/login");
    });
  };
  return (
    <>
      <Grid item xs={4}>
        <Grouplist />
        <FriendRequest />
      </Grid>
      <Grid item xs={3}>
        <Friends />
        <Mygroups />
      </Grid>
      <Grid item xs={3}>
        <Userlist />
        <Blocklist />
      </Grid>
      <button onClick={handleLogOut}>Logout</button>
    </>
  );
};

export default Home;
