import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "@mui/material/Alert";

const Blocklist = () => {
  const db = getDatabase();
  let [blocklist, setBlocklist] = useState([]);
  let data = useSelector((state) => state);
  // console.log(data.userdata.userInfo.uid);

  // useEffect(() => {
  //   const blockRef = ref(db, "block");
  //   onValue(blockRef, (snapshot) => {
  //     let arr = [];
  //     snapshot.forEach((item) => {
  //       if (item.val().blocbykid == data.userdata.userInfo.uid) {
  //         arr.push({
  //           id: item.key,
  //           block: item.val().block,
  //           blockid: item.val().blockid,
  //         });
  //       } else {
  //         arr.push({
  //           id: item.key,
  //           blockby: item.val().blockby,
  //           blockbyid: item.val().blockbyid,
  //         });
  //       }
  //     });
  //     setBlocklist(arr);
  //   });
  // }, []);

  useEffect(() => {
    const starCountRef = ref(db, "block");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().blockbyid == data.userdata.userInfo.uid) {
          arr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
            blockemail: item.val().blockemail,
          });
        } else if (item.val().blockid == data.userdata.userInfo) {
          arr.push({
            id: item.key,
            blockby: item.val().blockby,
            blockbyid: item.val().blockbyid,
            blockbyemail: item.val().blockbyemail,
          });
        }
      });
      setBlocklist(arr);
    });
  }, []);

  let handleUnblock = (item) => {
    set(push(ref(db, "friends")), {
      sendername: data.userdata.userInfo.displayName,
      senderid: data.userdata.userInfo.uid,
      senderemail: data.userdata.userInfo.email,
      receivername: item.block,
      receiverid: item.blockid,
      receiveremail: item.blockemail,
    }).then(() => {
      remove(ref(db, "block/" + item.id)).then(() => {
        toast("user Unblocked");
        // console.log("unblocked");
      });
    });
  };

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
          <h3>Block list</h3>
        </div>
        <div className="boxholder">
          {blocklist.length > 0 ? (
            blocklist.map((item) => (
              <div className="box">
                <div className="boximgholder">
                  <img src="./assets/profilepic.png" />
                </div>
                <div className="title">
                  {item.block ? <h3>{item.block}</h3> : <h3>{item.blockby}</h3>}
                  {item.blockemail ? (
                    <p>{item.blockemail}</p>
                  ) : (
                    <p>{item.blockbyemail}</p>
                  )}
                </div>
                <div>
                  <button
                    className="boxbtn"
                    onClick={() => handleUnblock(item)}
                  >
                    Unblock
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Alert variant="outlined" severity="info">
              No Block Users!
            </Alert>
          )}
        </div>
      </div>
    </>
  );
};

export default Blocklist;
