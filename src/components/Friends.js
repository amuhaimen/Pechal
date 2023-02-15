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

const Friends = () => {
  const db = getDatabase();
  let [friends, setFriends] = useState([]);
  let data = useSelector((state) => state);

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
    <div className="groupholder">
      <div className="titleholder">
        <h3>Friends</h3>
      </div>
      <div className="boxholder">
        {friends.map((item) => (
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
              <p>hello</p>
            </div>
            <div>
              <button className="boxbtn">Block</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
