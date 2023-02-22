import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Mygroups from "../components/Mygroups";
import Friends from "../components/Friends";
import JoinGrouplist from "../components/JoinGrouplist";

const Message = () => {
  let navigate = useNavigate();
  let data = useSelector((state) => state);

  // console.log(data.userdata.userInfo);
  useEffect(() => {
    if (!data.userdata.userInfo) {
      navigate("message");
    }
  }, []);
  return (
    <>
      <Grid item xs={4}>
        <JoinGrouplist />
        <Friends />
      </Grid>
      <Grid item xs={3}>
        <h1>xs=4 message</h1>
      </Grid>
      <Grid item xs={3}>
        <h1>xs=8 message</h1>
      </Grid>
    </>
  );
};

export default Message;
