import React, { useEffect, useState } from "react";
import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import { HiBackspace } from "react-icons/hi2";
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
import { Badge } from "@mui/material";

const Groups = () => {
  const db = getDatabase();
  const storage = getStorage();
  const [userlist, setUserlist] = useState([]);
  const [grouplist, setGrouplist] = useState([]);
  const [memberreq, setMemberreq] = useState([]);
  const [memberreqlist, setMemberreqlist] = useState([]);
  const [show, setShow] = useState(false);
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

  // Group member reuest list
  useEffect(() => {
    onValue(ref(db, "grouprequest"), (snap) => {
      let memberReqArr = [];
      snap.forEach((item) => {
        memberReqArr.push({ ...item.val(), reqID: item.key });
      });
      setMemberreq(memberReqArr);
    });
  }, []);

  // Group Request list
  const handlerequest = (item) => {
    setShow(true);
    let memberArr = [];
    let members = memberreq.find((m) => m?.grpID === item.grpID);
    let memberlist = userlist.find((u) => u?.userID === members?.requester);
    memberArr.push({
      ...item,
      reqID: members?.reqID,
      userID: memberlist?.userID,
      username: memberlist?.username,
      userPic: memberlist?.userPic,
    });
    setMemberreqlist(memberArr);
  };

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

  // Group Member accept by admin
  const handleMemberAccept = (item) => {
    set(push(ref(db, "groupmembers")), {
      grpID: item.grpID,
      memberID: item.userID,
    }).then(() => {
      remove(ref(db, "grouprequest/" + item.reqID)).then(() => {
        toast.success("Member Added...!", {
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
      <div className="groups">
        <div className="header">
          <div className="header_title">
            <h3>My Groups</h3>
          </div>
          {/* <div>
            <Searchbar />
          </div> */}
          <div className="header_option">
            <BsThreeDotsVertical />
          </div>
        </div>
        <div className="card_body">
          {show ? (
            <div className="member-req">
              <div className="req-head">
                <div></div>
                <div className="req-title">
                  <h4>Member Request</h4>
                </div>
                <div className="close-btn">
                  <HiBackspace onClick={() => setShow(false)} />
                </div>
              </div>
              <div className="req-body">
                {memberreqlist.map((item, i) => (
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
                    </div>
                    <div className="btn_group">
                      <Button
                        className="primary_btn unfriend"
                        variant="contained"
                        size="small"
                        onClick={() => handleMemberAccept(item)}>
                        Accept
                      </Button>
                      <Button
                        className="primary_btn block"
                        variant="contained"
                        size="small">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            grouplist.map((item, i) => (
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
                  <Badge badgeContent={10} max={9}>
                    <Button
                      className="primary_btn unfriend"
                      variant="contained"
                      size="small"
                      onClick={() => handlerequest(item)}>
                      Request
                    </Button>
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Groups;
