import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiNotification3Fill } from "react-icons/ri";
import { AiFillSetting } from "react-icons/ai";
import "./style.css";

const Sidemenu = () => {
  return (
    <>
      <div className="menuitem_wrapper">
        <Link to="/">
          <FaHome />
        </Link>
        <Link to="/message">
          <BsFillChatDotsFill />
        </Link>
        <Link to="/notification">
          <RiNotification3Fill />
        </Link>
        <Link to="/setting">
          <AiFillSetting />
        </Link>
      </div>
    </>
  );
};

export default Sidemenu;
