import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputBox from "./InputBox";
import { useSelector } from "react-redux";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import Alert from "@mui/material/Alert";

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

const JoinGrouplist = () => {
  const db = getDatabase();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let data = useSelector((state) => state);
  // console.log(data);
  // let [group, setGroup] = useState({
  //   groupname: "",
  //   grouptag: "",
  // });

  // let [gname, setGname] = useState("");
  // let [gtag, setGtag] = useState("");
  let [glist, setGlist] = useState([]);
  let [gname, setGname] = useState("");
  let [gtag, setGtag] = useState("");

  let handleCreateGroup = () => {
    set(push(ref(db, "groups")), {
      groupname: gname,
      grouptag: gtag,
      adminid: data.userdata.userInfo.uid,
      adminname: data.userdata.userInfo.displayName,
    }).then(() => {
      setOpen(false);
      console.log("created");
    });
  };

  useEffect(() => {
    const groupRef = ref(db, "groups");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().adminid != data.userdata.userInfo.uid) {
          arr.push({ ...item.val(), gid: item.key });
        }
      });
      setGlist(arr);
    });
  }, []);

  // let handleGroupJoin = (item) => {
  //   set(push(ref(db, "grouprequest")), {
  //     groupid: item.groupid,
  //     groupname: item.groupname,
  //     userid: data.userdata.userInfo.uid,
  //     username: data.userdata.userInfo.displayName,
  //   }).then(() => {
  //     console.log("joined");
  //   });
  // };

  let handleGroupJoin = (item) => {
    set(push(ref(db, "grouprequest")), {
      adminid: item.adminid,
      groupid: item.gid,
      groupname: item.groupname,
      userid: data.userdata.userInfo.uid,
      username: data.userdata.userInfo.displayName,
    }).then(() => {
      console.log("Group Request Sent");
    });
    // console.log(item);
  };

  return (
    <div className="groupholder">
      <div className="titleholder">
        <h3>Group list</h3>
        <button onClick={handleOpen}>Create Group</button>
      </div>
      <div className="boxholder">
        {glist.length > 0 ? (
          glist.map((item) => (
            <div className="box">
              <div className="boximgholder">
                <img src="./assets/profilepic.png" />
              </div>
              <div className="title">
                <p>{item.adminname}</p>
                <h3>{item.groupname}</h3>
                <p>{item.grouptag}</p>
              </div>
              <div>
                <button
                  className="boxbtn"
                  onClick={() => handleGroupJoin(item)}
                >
                  Join
                </button>
              </div>
            </div>
          ))
        ) : (
          <Alert variant="outlined" severity="info">
            No Groups Here!
          </Alert>
        )}
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
              Create Group
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <InputBox
                textChange={(e) => setGname(e.target.value)}
                type="text"
                label="Group Name"
                variant="outlined"
              />
              <br />
              <br />
              <InputBox
                textChange={(e) => setGtag(e.target.value)}
                type="text"
                label="Group Tag Name"
                variant="outlined"
              />
              <br />
              <br />
              <Button onClick={handleCreateGroup} variant="contained">
                Create Group
              </Button>
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default JoinGrouplist;
