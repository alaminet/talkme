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
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";

const Friends = () => {
  const db = getDatabase();
  const storage = getStorage();
  const [userlist, setUserlist] = useState([]);
  const [frndlist, setFrndlist] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
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
  }, []);

  // Read online users
  useEffect(() => {
    onValue(ref(db, "online/"), (snap) => {
      let online = [];
      snap.forEach((item) => {
        online.push(item.key);
      });
      setOnlineUser(online);
    });
  }, []);

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
  }, [userlist]);

  // Unfriend from frind list
  const handleUnfrnd = (item) => {
    remove(ref(db, "friends/" + item.frndID))
      .then(() => {
        set(push(ref(db, "notification/")), {
          senderID: users?.uid,
          receiverID: item?.userID,
          notice: "Unfriend",
          time: `${new Date()}`,
        });
      })
      .then(() => {
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
    set(push(ref(db, "blocked/")), {
      blockedTo: item?.userID,
      blockedBy: users?.uid,
    })
      .then(() => {
        set(push(ref(db, "notification/")), {
          senderID: users?.uid,
          receiverID: item?.userID,
          notice: "Blocked",
          time: `${new Date()}`,
        });
      })
      .then(() => {
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
            <div key={i} className="body_list">
              <div className="head-picture">
                {onlineUser.includes(item.userID) && (
                  <div className="status"></div>
                )}
                <div className="user_pic_70">
                  <picture>
                    <img
                      src={item?.userPic ?? defaultProfile}
                      alt={item?.username}
                    />
                  </picture>
                </div>
              </div>
              <div className="user_info">
                <div className="name">{item.username}</div>
                <div className="sub_name">
                  {onlineUser.includes(item.userID) ? "Online" : "Offline"}
                </div>
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

export default Friends;
