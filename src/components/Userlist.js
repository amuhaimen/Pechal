import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const Userlist = () => {
  const db = getDatabase();
  let [userlist, setUserlist] = useState([]);
  let [freq, setFreq] = useState([]);
  let [friends, setFriends] = useState([]);
  let [blocklist, setBlocklist] = useState([]);
  let data = useSelector((state) => state);
  // console.log(data.userdata.userInfo.uid);

  //==========userlist e user show korano start====================
  useEffect(() => {
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userdata.userInfo.uid != item.key) {
          arr.push({ ...item.val(), id: item.key });
          // console.log(item.val());
        }
      });
      setUserlist(arr);
    });
  }, []);
  //==================userlist e user show korano end=================

  let handlefriendRequest = (info) => {
    set(push(ref(db, "friendrequest")), {
      sendername: data.userdata.userInfo.displayName,
      senderid: data.userdata.userInfo.uid,
      senderemail: data.userdata.userInfo.email,
      receivername: info.displayName,
      receiverid: info.id,
      receiveremail: info.email,
    });
    // console.log(info);
  };

  useEffect(() => {
    const userRef = ref(db, "friendrequest");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverid + item.val().senderid);
        // console.log(item.val().receiverid + item.val().senderid);
      });
      setFreq(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "friends");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receiverid + item.val().senderid);
      });
      setFriends(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "block");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().blockid + item.val().blockbyid);
      });
      setBlocklist(arr);
    });
  }, []);

  return (
    <div className="groupholder">
      <div className="titleholder">
        <h3>User List</h3>
      </div>
      <div className="boxholder">
        {userlist.map((item) => (
          //uporer (item,index) er shathe ekta unique key prop dite hobe jeta to do te ache ,taile r error dibe na
          <div className="box">
            <div className="boximgholder">
              <img src="./assets/profilepic.png" />
            </div>
            <div className="title">
              <h3>{item.displayName}</h3>
              <p>{item.email}</p>
            </div>
            <div>
              {friends.includes(item.id + data.userdata.userInfo.uid) ||
              friends.includes(data.userdata.userInfo.uid + item.id) ? (
                <button className="boxbtn">Friend</button>
              ) : freq.includes(item.id + data.userdata.userInfo.uid) ||
                freq.includes(data.userdata.userInfo.uid + item.id) ? (
                <button className="boxbtn">pending</button>
              ) : blocklist.includes(item.id + data.userdata.userInfo.uid) ||
                blocklist.includes(data.userdata.userInfo.uid + item.id) ? (
                <button className="boxbtn">blocked</button>
              ) : (
                <button
                  onClick={() => handlefriendRequest(item)}
                  className="boxbtn"
                >
                  Send Request
                </button>
              )}
              {/* {friends.includes(item.id + data.userdata.userInfo.uid) ||
              friends.includes(data.userdata.userInfo.uid + item.id) ? (
                <button className="boxbtn">Friend</button>
              ) : freq.includes(item.id + data.userdata.userInfo.uid) ||
                freq.includes(data.userdata.userInfo.uid + item.id) ? (
                <button className="boxbtn">Pending</button>
              ) : (
                <button
                  onClick={() => handlefriendRequest(item)}
                  className="boxbtn"
                >
                  Send request
                </button>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Userlist;
