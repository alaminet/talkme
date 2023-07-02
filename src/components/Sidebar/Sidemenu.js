import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiNotification3Fill } from "react-icons/ri";
import { AiFillSetting } from "react-icons/ai";
import "./style.css";

const Sidemenu = () => {
  return (
    <>
      <div className="menuitem_wrapper">
        <NavLink to="/">
          <FaHome />
        </NavLink>
        <NavLink to="/messages">
          <BsFillChatDotsFill />
        </NavLink>
        <NavLink to="/notification">
          <RiNotification3Fill />
        </NavLink>
        <NavLink to="/settings">
          <AiFillSetting />
        </NavLink>
      </div>
    </>
  );
};

export default Sidemenu;
