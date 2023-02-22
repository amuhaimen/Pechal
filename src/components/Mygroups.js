import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
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

const Mygroups = () => {
  const db = getDatabase();
  let [glist, setGlist] = useState([]);
  let [grlist, setGrlist] = useState([]);
  let [gmlist, setGmlist] = useState([]);
  let data = useSelector((state) => state);

  const [open, setOpen] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleInfoClose = () => setOpenInfo(false);

  const handleOpen = (id) => {
    setOpen(true);
    const groupRef = ref(db, "grouprequest");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().groupid == id) {
          arr.push({ ...item.val(), did: item.key });
        }
      });
      setGrlist(arr);
    });
  };

  const handleInfoOpen = (id) => {
    setOpenInfo(true);
    const groupRef = ref(db, "groupmembers");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().groupid == id) {
          arr.push({ ...item.val(), did: item.key });
        }
      });
      setGmlist(arr);
    });
    // console.log(id);
  };

  let handleGrDelete = (id) => {
    remove(ref(db, "grouprequest/" + id)).then(() => {
      console.log("deleted");
    });
  };

  let handleGrAccept = (item) => {
    set(push(ref(db, "groupmembers")), {
      adminid: item.adminid,
      groupid: item.groupid,
      userid: item.userid,
      username: item.username,
      key: item.did,
    }).then(() => {
      remove(ref(db, "grouprequest/" + item.did));
    });
    // console.log(item);
  };

  useEffect(() => {
    const groupRef = ref(db, "groups");
    onValue(groupRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().adminid == data.userdata.userInfo.uid) {
          arr.push({ ...item.val(), gid: item.key });
        }
      });
      setGlist(arr);
    });
  }, []);

  let handleRemoveMembers = (item) => {
    remove(ref(db, "groupmembers/" + item.did)).then(() => {
      console.log("done");
    });
  };

  return (
    <div className="groupholder">
      <div className="titleholder">
        <h3>My Groups</h3>
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
                  onClick={() => handleInfoOpen(item.gid)}
                >
                  Info
                </button>
                <button className="boxbtn" onClick={() => handleOpen(item.gid)}>
                  MR
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Group Request
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {grlist.length > 0 ? (
                grlist.map((item) => (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.username}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {item.username}
                            </Typography>
                            {" —  Wants to join your group"}
                          </React.Fragment>
                        }
                      />
                      <Button
                        onClick={() => handleGrAccept(item)}
                        variant="outlined"
                      >
                        Accept
                      </Button>
                      <IconButton
                        onClick={() => handleGrDelete(item.did)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </>
                ))
              ) : (
                <Alert variant="outlined" severity="info">
                  No Group Request!
                </Alert>
              )}
            </List>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openInfo}
        onClose={handleInfoClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Members
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {gmlist.length > 0 ? (
                gmlist.map((item) => (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.username}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {item.username}
                            </Typography>
                            {" —   is a member of this group"}
                          </React.Fragment>
                        }
                      />
                      <Button
                        onClick={() => handleRemoveMembers(item)}
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </>
                ))
              ) : (
                <Alert variant="outlined" severity="info">
                  No Members!
                </Alert>
              )}
            </List>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Mygroups;
