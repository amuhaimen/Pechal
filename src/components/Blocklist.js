import React from "react";

const Blocklist = () => {
  return (
    <div className="groupholder">
      <div className="titleholder">
        <h3>Block list</h3>
      </div>
      <div className="boxholder">
        <div className="box">
          <div className="boximgholder">
            <img src="./assets/profilepic.png" />
          </div>
          <div className="title">
            <h3>Muhaimen</h3>
            <p>hello</p>
          </div>
          <div>
            <button className="boxbtn">Unblock</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blocklist;
