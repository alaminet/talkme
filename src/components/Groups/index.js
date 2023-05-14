import React, { useEffect, useState } from "react";
import "./style.css";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import Button from "@mui/material/Button";
import Searchbar from "../Searchbar";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const Groups = () => {
  const db = getDatabase();
  const storage = getStorage();
  const [userlist, setUserlist] = useState([]);
  const [grouplist, setGrouplist] = useState([]);
  const users = useSelector((user) => user.loginSlice.login);
  const defaultProfile = "./images/avatar_boy_cap.png";

  // user list from firebase
  useEffect(() => {
    const userCountRef = ref(db, "users/");
    onValue(userCountRef, (snap) => {
      let userArr = [];
      snap.forEach((item) => {
        getDownloadURL(storageRef(storage, "userpic/" + item.key))
          .then((url) => {
            userArr.push({ ...item.val(), userID: item.key, userPic: url });
          })
          .catch((error) => {
            userArr.push({ ...item.val(), userID: item.key, userPic: null });
          })
          .then(() => {
            setUserlist([...userArr]);
          });
      });
    });
  }, []);

  // Get Group list from database
  useEffect(() => {
    const groupCountRef = ref(db, "groups/");
    onValue(groupCountRef, (snap) => {
      let grpArr = [];
      snap.forEach((item) => {
        let user = userlist.find((g) => g?.userID === item.val().groupAdmin);
        if (item.val().groupAdmin === users.uid) {
          grpArr.push({
            ...item.val(),
            grpID: item.key,
            adminName: user?.username,
          });
        }
      });
      setGrouplist(grpArr);
    });
  }, [userlist]);

  console.log(grouplist);

  return (
    <>
      <div className="groups">
        <div className="header">
          <div className="header_title">
            <h3>My Groups</h3>
          </div>
          <div>
            <Searchbar />
          </div>
          <div className="header_option">
            <HiOutlineViewGridAdd />
          </div>
        </div>
        <div className="card_body">
          {grouplist.map((item, i) => (
            <div className="body_list">
              <div className="user_pic_70">
                <picture>
                  <img src="./images/avatar_boy_cap.png" alt="user pic" />
                </picture>
              </div>
              <div className="user_info">
                <div className="name">{item.groupName}</div>
                <div className="sub_name">{item.groupTag}</div>
              </div>
              <div className="btn_group">
                <Button
                  className="primary_btn block"
                  variant="contained"
                  size="small">
                  Member
                </Button>
                <Button
                  className="primary_btn unfriend"
                  variant="contained"
                  size="small">
                  Request
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Groups;
