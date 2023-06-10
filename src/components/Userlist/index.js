import React, { useEffect, useState } from "react";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdPersonAdd } from "react-icons/md";
import Searchbar from "../Searchbar";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import { Button } from "@mui/material";

const Userlist = () => {
  const db = getDatabase();
  const storage = getStorage();
  const navigate = useNavigate();
  const [userList, setUserlist] = useState([]);
  const [friendlist, setFriendlist] = useState([]);
  const [blockedlist, setBlockedlist] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
  const [friendReq, setFriendReq] = useState([]);
  const defaultProfile = "./images/avatar_boy_cap.png";
  const users = useSelector((user) => user.loginSlice.login);

  // Read user list from firebase
  useEffect(() => {
    // Userlist
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      let userArr = [];
      snapshot.forEach((listuser) => {
        //Remove login user from this list
        if (users.uid !== listuser.key) {
          let frnds = friendlist.find(
            (frnd) => frnd?.includes(listuser.key) && frnd?.includes(users.uid)
          );
          let blocks = blockedlist.find(
            (b) => b.blockedBy === listuser.key || b.blockedTo === listuser.key
          );
          if (!frnds && !blocks) {
            getDownloadURL(storageRef(storage, "userpic/" + listuser.key))
              .then((url) => {
                userArr.push({
                  ...listuser.val(),
                  id: listuser.key,
                  userPic: url,
                });
              })
              .catch((error) => {
                userArr.push({
                  ...listuser.val(),
                  id: listuser.key,
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
  }, [friendlist, friendReq, blockedlist]);

  // Read online users
  useEffect(() => {
    onValue(ref(db, "online/"), (snap) => {
      let online = [];
      snap.forEach((item) => {
        online.push(item.key);
      });
      setOnlineUser(online);
    });
  }, [userList]);

  // Friendlist from firebase
  useEffect(() => {
    const frndCountRef = ref(db, "friends/");
    onValue(frndCountRef, (snapshot) => {
      let frndArr = [];
      snapshot.forEach((item) => {
        frndArr.push(item.val().receiverID + item.val().senderID);
      });
      setFriendlist(frndArr);
    });
  }, []);

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
  }, []);

  // Send Friend Request list
  useEffect(() => {
    const starCountRef = ref(db, "friendrequest/");
    let reqArr = [];
    onValue(starCountRef, (snapshot) => {
      snapshot.forEach((frndReqList) => {
        reqArr.push(frndReqList.val().receiverID + frndReqList.val().senderID);
      });
      setFriendReq(reqArr);
    });
  }, []);

  //   Friend Request send
  const handleRequest = (item) => {
    set(push(ref(db, "friendrequest")), {
      senderID: users.uid,
      receiverID: item.id,
    }).then(() => {
      navigate("/");
      toast.success("Friend Request Sent...!", {
        position: "bottom-center",
        autoClose: 1000,
        pauseOnHover: false,
        theme: "light",
      });
    });
  };

  // Cancel Friend Req from firebase
  // const handleCancelReq = (req) => {
  //   remove(ref(db, "friendrequest/" + req.ID))
  //     .then(() => {
  //       navigate("/");
  //       toast.warn("Cancel Request...!", {
  //         position: "bottom-center",
  //         autoClose: 1000,
  //         pauseOnHover: false,
  //         theme: "light",
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error.code);
  //     });
  // };
  return (
    <>
      <ToastContainer />
      <div className="user_list">
        <div className="header">
          <div className="header_title">
            <h3>User List</h3>
          </div>
          <div>
            <Searchbar />
          </div>
          <div className="header_option">
            <BsThreeDotsVertical />
          </div>
        </div>
        <div className="card_body">
          {userList.map((item, i) => (
            <div key={i} className="body_list">
              <div className="head-picture">
                {onlineUser.includes(item.id) && <div className="status"></div>}
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
                  {onlineUser.includes(item.id) ? "Online" : "Offline"}
                </div>
              </div>
              <div className="btn_group">
                {friendReq.includes(item.id + users.uid) ||
                friendReq.includes(users.uid + item.id) ? (
                  <Button
                    disabled
                    className=""
                    variant="contained"
                    size="small">
                    <MdPersonAdd />
                  </Button>
                ) : (
                  <Button
                    className="primary_btn"
                    variant="contained"
                    onClick={() => handleRequest(item)}
                    size="small">
                    <MdPersonAdd />
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

export default Userlist;
