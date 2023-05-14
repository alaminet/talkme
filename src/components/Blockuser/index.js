import React, { useEffect, useState } from "react";
import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "@mui/material/Button";
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

const Blockuser = () => {
  const db = getDatabase();
  const storage = getStorage();
  const users = useSelector((user) => user.loginSlice.login);
  const defaultProfile = "./images/avatar_boy_cap.png";
  const [blockedlist, setBlockedlist] = useState([]);
  const [blockuser, setBlockuser] = useState([]);

  // Make blocked list with user info
  useEffect(() => {
    const userCountRef = ref(db, "users/");
    onValue(userCountRef, (snapshot) => {
      let userArr = [];
      snapshot.forEach((userList) => {
        if (userList.key !== users.uid) {
          //Remove login user from this list
          let blocks = blockedlist.find(
            (b) => b?.blockedBy === users.uid && b?.blockedTo === userList.key
          );
          if (blocks) {
            getDownloadURL(storageRef(storage, "userpic/" + userList.key))
              .then((url) => {
                userArr.push({
                  ...userList.val(),
                  userID: userList.key,
                  blkID: blocks?.blkID,
                  blockedBy: blocks?.blockedBy,
                  userPic: url,
                });
              })
              .catch(() => {
                userArr.push({
                  ...userList.val(),
                  userID: userList.key,
                  blkID: blocks?.blkID,
                  blockedBy: blocks?.blockedBy,
                  userPic: null,
                });
              })
              .then(() => {
                setBlockuser([...userArr]);
              });
          }
        }
      });
    });
  }, [blockedlist]);

  // blocked list from firebase
  useEffect(() => {
    const blockCountRef = ref(db, "blocked/");
    onValue(blockCountRef, (snapshot) => {
      let blockdArr = [];
      snapshot.forEach((item) => {
        blockdArr.push({ ...item.val(), blkID: item.key });
      });
      setBlockedlist(blockdArr);
    });
  }, [db]);

  // unblock from block list
  const handleUnblock = (item) => {
    remove(ref(db, "blocked/" + item.blkID)).then(() => {
      set(push(ref(db, "friends")), {
        senderID: item.userID,
        receiverID: users.uid,
      }).then(() => {
        toast.success(item.username + " Unblocked...!", {
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
      <div className="blockuser">
        <div className="header">
          <div className="header_title">
            <h3>Block User</h3>
          </div>
          <div className="header_option">
            <BsThreeDotsVertical />
          </div>
        </div>
        <div className="card_body">
          {blockuser.map((item, i) => (
            <div key={i} className="body_list">
              <div className="user_pic_70">
                <picture>
                  <img
                    src={item?.userPic ?? defaultProfile}
                    alt={item?.username}
                  />
                </picture>
              </div>
              <div className="user_info">
                <div className="name">{item.username}</div>
                <div className="sub_name">{item.userID}</div>
              </div>
              <div className="btn_group">
                {item.blockedBy === users.uid ? (
                  <Button
                    className="primary_btn"
                    variant="contained"
                    size="small"
                    onClick={() => handleUnblock(item)}>
                    Unblock
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="primary_btn"
                    variant="contained"
                    size="small">
                    Unblock
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Blockuser;
