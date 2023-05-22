import React, { useEffect, useState } from "react";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import Button from "@mui/material/Button";
import Searchbar from "../Searchbar";

import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const MsgGroup = () => {
  const db = getDatabase();
  const storage = getStorage();
  const [grouplist, setGrouplist] = useState([]);
  const [userlist, setUserlist] = useState([]);
  const [grpreq, setGrpreq] = useState([]);
  const users = useSelector((user) => user.loginSlice.login);
  const defaultProfile = "./images/avatar_boy_cap.png";

  // Get Group list from database
  useEffect(() => {
    const groupCountRef = ref(db, "groups/");
    onValue(groupCountRef, (snap) => {
      let grpArr = [];
      snap.forEach((item) => {
        let user = userlist.find((g) => g?.userID === item.val().groupAdmin);
        let memberreq = grpreq.find(
          (r) => r?.requester === users.uid && r?.grpID === item.key
        );
        grpArr.push({
          ...item.val(),
          grpID: item.key,
          adminName: user?.username,
          requester: memberreq?.requester,
          reqID: memberreq?.reqID,
        });
      });
      setGrouplist(grpArr);
    });
  }, [db, users]);

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
  }, [db, grouplist, grpreq]);

  // Joined group member list
  useEffect(() => {
    onValue(ref(db, "grouprequest/"), (snap) => {
      let reqArr = [];
      snap.forEach((item) => {
        let user = userlist.find((g) => g?.userID === item.val().requester);
        reqArr.push({ ...item.val(), reqID: item.key });
      });
      setGrpreq(reqArr);
    });
  }, [db]);

  return (
    <>
      <ToastContainer />
      <div className="group_request">
        <div className="header">
          <div className="header_title">
            <h3>Group List</h3>
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
            <div key={i} className="body_list">
              <div className="user_pic_70">
                <picture>
                  <img
                    src={item.userPic ?? defaultProfile}
                    alt={item.groupName}
                  />
                </picture>
              </div>
              <div className="user_info">
                <div className="name">
                  {item.groupName}{" "}
                  <span className="group_admin">-by {item?.adminName}</span>
                </div>
                <div className="sub_name">{item.groupTag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MsgGroup;
