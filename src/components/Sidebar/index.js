import React from "react";
import { BiLogOut } from "react-icons/bi";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./style.css";
import Sidemenu from "./Sidemenu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Loginuser } from "../../features/Slice/UserSlice";
import Profilemodal from "../Modals/Profilemodal";
import { useState } from "react";
import { getDatabase, ref, remove } from "firebase/database";

const Sidebar = () => {
  const db = getDatabase();
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((user) => user.loginSlice.login);

  // ProfileModal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  // Logout
  const handleLogut = () => {
    signOut(auth)
      .then(() => {
        remove(ref(db, "online/" + users.uid));
        localStorage.removeItem("users");
        dispatch(Loginuser(null));
        navigate("/");
      })
      .catch((error) => {
        console.log(error.code);
      });
  };
  return (
    <>
      <div className="sidebar">
        <div className="sidebar_wrapper">
          <div className="user_display">
            <div className="profile_pic" onClick={handleOpen}>
              <picture>
                <img
                  src={users.photoURL || "./images/avatar_boy_cap.png"}
                  onError={(e) => {
                    e.target.src = "./images/avatar_boy_cap.png";
                  }}
                  alt={users.displayName}
                />
              </picture>
              <div className="profile_overlay">
                <FaCloudUploadAlt />
              </div>
            </div>
            <h4>{users.displayName}</h4>
          </div>
          <div className="menu_items">
            <Sidemenu />
          </div>
          <div className="logout" onClick={handleLogut}>
            <BiLogOut />
          </div>
        </div>
      </div>
      <Profilemodal open={open} setOpen={setOpen} />
    </>
  );
};

export default Sidebar;
