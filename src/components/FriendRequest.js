import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";
import Alert from "@mui/material/Alert";

const FriendRequest = () => {
  const db = getDatabase();
  let [freq, setFreq] = useState([]);

  let data = useSelector((state) => state);
  console.log(data);

  useEffect(() => {
    const starCountRef = ref(db, "friendrequest");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().receiverid == data.userdata.userInfo.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setFreq(arr);
    });
  }, []);

  let handleDeleteRequest = (item) => {
    remove(ref(db, "friendrequest/" + item.id)).then(() => {
      console.log("deleted");
    });
  };

  let handleAcceptRequest = (item) => {
    set(push(ref(db, "friends")), {
      ...item,
    }).then(() => {
      remove(ref(db, "friendrequest")).then(() => {
        console.log("Accepted");
      });
    });
  };

  return (
    <div className="groupholder">
      <div className="titleholder">
        <h3>Friend Request</h3>
      </div>
      <div className="boxholder">
        {freq.length > 0 ? (
          freq.map((item) => (
            <div className="box">
              <div className="boximgholder">
                <img src="./assets/profilepic.png" />
              </div>
              <div className="title">
                <h3>{item.sendername}</h3>
                <p>hello</p>
              </div>
              <div>
                <button
                  onClick={() => handleAcceptRequest(item)}
                  className="boxbtn"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeleteRequest(item)}
                  className="boxbtn"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <Alert variant="outlined" severity="info">
            No Friend Request Here
          </Alert>
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
