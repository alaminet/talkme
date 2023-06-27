import React, { useEffect, useState } from "react";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import Searchbar from "../Searchbar";

import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { ActiveSingle } from "../../features/Slice/ActiveSignleSlice";

const MsgGroup = () => {
  const db = getDatabase();
  const storage = getStorage();
  const dispatch = useDispatch();
  const [grouplist, setGrouplist] = useState([]);
  const [userlist, setUserlist] = useState([]);
  const [memberlist, setMemberlist] = useState([]);
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
            error &&
              userArr.push({ ...item.val(), userID: item.key, userPic: null });
          })
          .then(() => {
            setUserlist([...userArr]);
          });
      });
    });
  }, []);

  // Get Group members from database
  useEffect(() => {
    onValue(ref(db, "groupmembers"), (snap) => {
      let memberArr = [];
      snap.forEach((item) => {
        if (item.val().memberID === users.uid) {
          memberArr.push(item.val().grpID);
        }
      });
      setMemberlist(memberArr);
    });
  }, []);

  // Get Group list from database
  useEffect(() => {
    const groupCountRef = ref(db, "groups/");
    onValue(groupCountRef, (snap) => {
      let grpArr = [];
      snap.forEach((item) => {
        let user = userlist.find((u) => u?.userID === item.val().groupAdmin);
        if (
          memberlist.includes(item.key) ||
          item.val().groupAdmin === users.uid
        ) {
          grpArr.push({
            ...item.val(),
            grpID: item.key,
            adminName: user?.username,
          });
        }
      });
      setGrouplist(grpArr);
    });
  }, [userlist, memberlist]);

  // Active Group slice
  const handleGroup = (item) => {
    dispatch(
      ActiveSingle({
        status: "group",
        userID: item.grpID,
        username: item.groupName,
        userPic: null,
      })
    );
  };

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
            <div
              key={i}
              className="body_list"
              onClick={() => handleGroup(item)}>
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
