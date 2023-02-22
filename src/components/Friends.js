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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "@mui/material/Alert";

const Friends = () => {
  const db = getDatabase();
  let [friends, setFriends] = useState([]);
  let data = useSelector((state) => state);

  let handleBlock = (item) => {
    data.userdata.userInfo.uid == item.senderid
      ? set(push(ref(db, "block")), {
          block: item.receivername,
          blockid: item.receiverid,
          blockemail: item.receiveremail,
          blockby: item.sendername,
          blockbyid: item.senderid,
          blockbyemail: item.senderemail,
        }).then(() => {
          remove(ref(db, "friends/" + item.id)).then(() => {
            toast("user blocked");
          });
        })
      : set(push(ref(db, "block")), {
          block: item.sendername,
          blockid: item.senderid,
          blockemail: item.senderemail,
          blockby: item.receivername,
          blockbyid: item.receiverid,
          blockbyemail: item.receiveremail,
        }).then(() => {
          remove(ref(db, "friends/" + item.id)).then(() => {
            toast("user blocked");
          });
        });
    console.log(item);
  };

  useEffect(() => {
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          data.userdata.userInfo.uid == item.val().senderid ||
          data.userdata.userInfo.uid == item.val().receiverid
        ) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setFriends(arr);
    });
  }, []);
  return (
    <>
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
      <div className="groupholder">
        <div className="titleholder">
          <h3>Friends</h3>
        </div>
        <div className="boxholder">
          {friends.length > 0 ? (
            friends.map((item) => (
              <div className="box">
                <div className="boximgholder">
                  <img src="./assets/profilepic.png" />
                </div>
                <div className="title">
                  {data.userdata.userInfo.uid == item.senderid ? (
                    <h3>{item.receivername}</h3>
                  ) : (
                    <h3>{item.sendername}</h3>
                  )}
                  {data.userdata.userInfo.email == item.senderemail ? (
                    <p>{item.receiveremail}</p>
                  ) : (
                    <p>{item.senderemail}</p>
                  )}
                </div>
                <div>
                  <button onClick={() => handleBlock(item)} className="boxbtn">
                    Block
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Alert variant="outlined" severity="info">
              No Friends!
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};

export default Friends;
