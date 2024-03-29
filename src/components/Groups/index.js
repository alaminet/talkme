import React, { useEffect, useState } from "react";
import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCloudUploadAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { HiBackspace } from "react-icons/hi2";
import Alert from "@mui/material/Alert";
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
import Grouppicmodal from "../Modals/Grouppicmodal";

const Groups = () => {
  const db = getDatabase();
  const storage = getStorage();
  const [userlist, setUserlist] = useState([]);
  const [grouplist, setGrouplist] = useState([]);
  const [memberreq, setMemberreq] = useState([]);
  const [memberlist, setMemberlist] = useState([]);
  const [memberreqlist, setMemberreqlist] = useState([]);
  const [groupMember, setGroupMember] = useState([]);
  const [show, setShow] = useState(false);
  const [showmember, setShowmember] = useState(false);
  const users = useSelector((user) => user.loginSlice.login);
  const defaultProfile = "./images/avatar_boy_cap.png";

  // GroupPicModal
  const [open, setOpen] = useState(false);
  const [selectGrp, setSelectGrp] = useState([]);
  const handleOpen = (item) => {
    setOpen(true);
    setSelectGrp(item);
  };

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

  // Group Member List from Firebase
  useEffect(() => {
    onValue(ref(db, "groupmembers"), (snap) => {
      let memberArr = [];
      snap.forEach((item) => {
        memberArr.push({ ...item.val(), memberAcceptID: item.key });
      });
      setMemberlist(memberArr);
    });
  }, []);

  // Get Group list from database
  useEffect(() => {
    const groupCountRef = ref(db, "groups/");
    onValue(groupCountRef, (snap) => {
      let grpArr = [];
      let reqArr = [];
      snap.forEach((item) => {
        let user = userlist.find((g) => g?.userID === item.val().groupAdmin);
        let request = memberreq.find((m) => m?.grpID === item.key);
        if (item.val().groupAdmin === users.uid) {
          if (item.key === request?.grpID) {
            reqArr.push({ ...request });
          }
          getDownloadURL(storageRef(storage, "GroupPic/" + item.key))
            .then((downloadURL) => {
              grpArr.push({
                ...item.val(),
                grpID: item.key,
                adminName: user?.username,
                grpReq: reqArr?.length,
                grpPic: downloadURL,
              });
            })
            .catch((error) => {
              grpArr.push({
                ...item.val(),
                grpID: item.key,
                adminName: user?.username,
                grpReq: reqArr?.length,
                grpPic: null,
              });
            })
            .then(() => {
              setGrouplist([...grpArr]);
            });
        }
      });
    });
  }, [userlist]);

  // Group member request list
  useEffect(() => {
    onValue(ref(db, "grouprequest"), (snap) => {
      let memberReqArr = [];
      snap.forEach((item) => {
        memberReqArr.push({ ...item.val(), mreqID: item.key });
      });
      setMemberreq(memberReqArr);
    });
  }, [db, show, memberreqlist]);

  // Group Request list
  const handlerequest = (item) => {
    setShow(true);
    let memberArr = [];
    let reqArr = [];
    memberreq.find((m) => {
      if (m?.grpID === item.grpID) {
        reqArr.push({ ...m });
      }
    });
    userlist.find((u) => {
      reqArr.find((arr) => {
        if (arr?.requester === u.userID) {
          memberArr.push({
            ...u,
            mreqID: arr?.mreqID,
            grpID: arr?.grpID,
          });
        }
      });
    });
    setMemberreqlist(memberArr);
  };

  // Group Member accept by admin
  const handleMemberAccept = (item) => {
    console.log(item);
    set(push(ref(db, "groupmembers")), {
      grpID: item.grpID,
      memberID: item.userID,
    }).then(() => {
      remove(ref(db, "grouprequest/" + item.mreqID)).then(() => {
        toast.success("Member Added...!", {
          position: "bottom-center",
          autoClose: 1000,
          pauseOnHover: false,
          theme: "light",
        });
      });
    });
  };

  // Group Member request rejection
  const handleMemberReject = (item) => {
    remove(ref(db, "grouprequest/" + item.mreqID)).then(() => {
      toast.warn("Request Cancel...!", {
        position: "bottom-center",
        autoClose: 1000,
        pauseOnHover: false,
        theme: "light",
      });
    });
  };

  // Group Member list
  const handleMembers = (item) => {
    setShowmember(true);
    let gmemberArr = [];
    let gMember = memberlist.find((m) => m?.grpID === item.grpID);
    let gmemberlist = userlist.find((u) => u?.userID === gMember?.memberID);
    gmemberlist &&
      gmemberArr.push({
        ...item,
        memberAcceptID: gMember?.memberAcceptID,
        userID: gmemberlist?.userID,
        username: gmemberlist?.username,
        userPic: gmemberlist?.userPic,
      });
    setGroupMember(gmemberArr);
  };

  // Member removed from group
  const handleMemberRemove = (item) => {
    remove(ref(db, "groupmembers/" + item.memberAcceptID)).then(() => {
      toast.warn("Member Removed...!", {
        position: "bottom-center",
        autoClose: 1000,
        pauseOnHover: false,
        theme: "light",
      });
    });
  };

  // Member push from the group chat
  const handleMemberPush = (item) => {
    set(push(ref(db, "grouppushmember")), {
      grpID: item.grpID,
      pushID: item.userID,
    }).then(() => {
      toast.warn("Member Push...!", {
        position: "bottom-center",
        autoClose: 1000,
        pauseOnHover: false,
        theme: "light",
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
          {showmember ? (
            <div className="member-list">
              <div className="head">
                <div></div>
                <div>
                  <h4>Member List</h4>
                </div>
                <div className="close-btn">
                  <HiBackspace onClick={() => setShowmember(false)} />
                </div>
              </div>
              <div className="body">
                {groupMember.length ? (
                  groupMember.map((item, i) => (
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
                          onClick={() => handleMemberPush(item)}>
                          Push
                        </Button>
                        <Button
                          className="primary_btn block"
                          variant="contained"
                          size="small"
                          onClick={() => handleMemberRemove(item)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <Alert severity="warning">No Member Found..!</Alert>
                )}
              </div>
            </div>
          ) : show ? (
            <div className="member-req">
              <div className="head">
                <div></div>
                <div className="req-title">
                  <h4>Member Request</h4>
                </div>
                <div className="close-btn">
                  <HiBackspace onClick={() => setShow(false)} />
                </div>
              </div>
              <div className="body">
                {memberreqlist.length ? (
                  memberreqlist.map((item, i) => (
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
                          size="small"
                          onClick={() => handleMemberReject(item)}>
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <Alert severity="warning">No Member Request..!</Alert>
                )}
              </div>
            </div>
          ) : (
            grouplist.map((item, i) => (
              <div key={i} className="body_list">
                <div
                  className="user_pic_70 group-pic"
                  onClick={() => handleOpen(item)}>
                  <picture>
                    <img
                      src={item?.grpPic ?? defaultProfile}
                      alt={item?.groupName}
                    />
                  </picture>
                  <div className="profile_overlay">
                    <FaCloudUploadAlt />
                  </div>
                </div>
                <div className="user_info">
                  <div className="name">{item?.groupName}</div>
                  <div className="sub_name">{item?.groupTag}</div>
                </div>
                <div className="btn_group">
                  <Badge badgeContent={item?.grpReq} max={9}>
                    <Button
                      className="primary_btn unfriend"
                      variant="contained"
                      size="small"
                      onClick={() => handlerequest(item)}>
                      Request
                    </Button>
                  </Badge>
                  <Button
                    className="primary_btn block"
                    variant="contained"
                    size="small"
                    onClick={() => handleMembers(item)}>
                    Member
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Grouppicmodal open={open} setOpen={setOpen} selectGrp={selectGrp} />
    </>
  );
};

export default Groups;
