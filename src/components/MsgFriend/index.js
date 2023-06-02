import React, { useEffect, useState } from "react";
import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
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
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import { ActiveSingle } from "../../features/Slice/ActiveSignleSlice";

const MsgFriend = () => {
  const db = getDatabase();
  const storage = getStorage();
  const dispatch = useDispatch();
  const [userlist, setUserlist] = useState([]);
  const [frndlist, setFrndlist] = useState([]);
  const users = useSelector((user) => user.loginSlice.login);
  const defaultProfile = "./images/avatar_boy_cap.png";

  // Make frind list with user info
  useEffect(() => {
    const userCountRef = ref(db, "users/");
    onValue(userCountRef, (snapshot) => {
      let userArr = [];
      snapshot.forEach((userList) => {
        if (userList.key !== users.uid) {
          //Remove login user from this list
          let frnds = frndlist.find(
            (f) =>
              f?.senderID === userList.key || f?.receiverID === userList.key
          );
          if (frnds) {
            getDownloadURL(storageRef(storage, "userpic/" + userList.key))
              .then((url) => {
                userArr.push({
                  ...userList.val(),
                  userID: userList.key,
                  frndID: frnds.frndID,
                  userPic: url,
                });
              })
              .catch((error) => {
                userArr.push({
                  ...userList.val(),
                  userID: userList.key,
                  frndID: frnds.frndID,
                  userPic: null,
                });
              })
              .then(() => {
                setUserlist([...userArr]);
              });
          }
        }
      });
    });
  }, [db, frndlist]);

  // Get frind list from firebase
  useEffect(() => {
    const frndCountRef = ref(db, "friends/");
    onValue(frndCountRef, (snap) => {
      let frndArr = [];
      snap.forEach((item) => {
        if (
          item.val().senderID === users.uid ||
          item.val().receiverID === users.uid
        ) {
          frndArr.push({ ...item.val(), frndID: item.key });
        }
      });
      setFrndlist(frndArr);
    });
  }, []);

  // Unfriend from frind list
  const handleUnfrnd = (item) => {
    remove(ref(db, "friends/" + item.frndID)).then(() => {
      toast.warn(item.username + " Unfriend...!", {
        position: "bottom-center",
        autoClose: 1000,
        pauseOnHover: false,
        theme: "light",
      });
    });
  };

  // Block from friend list
  const handleblock = (item) => {
    set(push(ref(db, "blocked")), {
      blockedTo: item.userID,
      blockedBy: users.uid,
    }).then(() => {
      remove(ref(db, "friends/" + item.frndID)).then(() => {
        toast.warn(item.username + " Blocked...!", {
          position: "bottom-center",
          autoClose: 1000,
          pauseOnHover: false,
          theme: "light",
        });
      });
    });
  };

  // Active frind slice
  const handleSingle = (item) => {
    dispatch(
      ActiveSingle({
        status: "single",
        userID: item.userID,
        username: item.username,
        userPic: item.userPic,
      })
    );
  };

  return (
    <>
      <ToastContainer />
      <div className="friends">
        <div className="header">
          <div className="header_title">
            <h3>Friends</h3>
          </div>
          <div>
            <Searchbar />
          </div>
          <div className="header_option">
            <BsThreeDotsVertical />
          </div>
        </div>
        <div className="card_body">
          {userlist.map((item, i) => (
            <div
              key={i}
              className="body_list"
              onClick={() => handleSingle(item)}>
              <div className="user_pic_70">
                <picture>
                  <img
                    src={item.userPic ?? defaultProfile}
                    alt={item.username}
                  />
                </picture>
              </div>
              <div className="user_info">
                <div className="name">{item.username}</div>
                {/* <div className="sub_name">{item.userID}</div> */}
              </div>
              <div className="btn_group">
                <Button
                  className="primary_btn"
                  variant="contained"
                  size="small"
                  onClick={() => handleUnfrnd(item)}>
                  Unfriend
                </Button>
                <Button
                  className="primary_btn cancel"
                  variant="contained"
                  size="small"
                  onClick={() => handleblock(item)}>
                  Block
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MsgFriend;
