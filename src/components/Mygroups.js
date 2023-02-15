import React from "react";

const Mygroups = () => {
  return (
    <div className="groupholder">
      <div className="titleholder">
        <h3>My Groups</h3>
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
            <button className="boxbtn">Info</button>
            <button className="boxbtn">MR</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mygroups;
