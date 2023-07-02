import React, { useEffect, useState } from "react";
import "./style.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
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
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";

const FriendRequest = () => {
  const db = getDatabase();
  const storage = getStorage();
  const [friendRequest, setFriendRequest] = useState([]);
  const defaultProfile = "./images/avatar_boy_cap.png";
  const users = useSelector((user) => user.loginSlice.login);

  // Friend Reques list
  useEffect(() => {
    const starCountRef = ref(db, "friendrequest/");
    onValue(starCountRef, (snapshot) => {
      let reqArr = [];
      snapshot.forEach((frndReqList) => {
        if (frndReqList.val().receiverID === users.uid) {
          const userCountRef = ref(db, "users/");
          onValue(userCountRef, (snap) => {
            snap.forEach((reqUsers) => {
              if (reqUsers.key === frndReqList.val().senderID) {
                getDownloadURL(storageRef(storage, "userpic/" + reqUsers.key))
                  .then((url) => {
                    reqArr.push({
                      ...reqUsers.val(),
                      reqID: frndReqList.key,
                      id: reqUsers.key,
                      userPic: url,
                    });
                  })
                  .catch((error) => {
                    reqArr.push({
                      ...reqUsers.val(),
                      reqID: frndReqList.key,
                      id: reqUsers.key,
                      userPic: null,
                    });
                  })
                  .then(() => {
                    setFriendRequest([...reqArr]);
                  });
                // reqArr.push({
                //   ...reqUsers.val(),
                //   reqID: frndReqList.key,
                //   id: reqUsers.key,
                // });
              }
            });
          });
        }
      });
      // setFriendRequest(reqArr);
    });
  }, [db, friendRequest]);

  // Accept Friend Request
  const handleAcceptReq = (item) => {
    set(push(ref(db, "friends")), {
      senderID: item.id,
      receiverID: users.uid,
    }).then(() => {
      remove(ref(db, "friendrequest/" + item.reqID))
        .then(() => {
          set(push(ref(db, "notification/")), {
            senderID: users?.uid,
            receiverID: item?.id,
            notice: "now Friends",
            time: `${new Date()}`,
          });
        })
        .then(() => {
          toast.success("Friend Accept...!", {
            position: "bottom-center",
            autoClose: 1000,
            pauseOnHover: false,
            theme: "light",
          });
        });
    });
  };

  // Cancel Friend Request
  const handleCancelReq = (item) => {
    remove(ref(db, "friendrequest/" + item.reqID))
      .then(() => {
        set(push(ref(db, "notification/")), {
          senderID: users?.uid,
          receiverID: item?.id,
          notice: "not accept",
          time: `${new Date()}`,
        });
      })
      .then(() => {
        toast.warn("Cancel Request...!", {
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
      <div className="friend_request">
        <div className="header">
          <div className="header_title">
            <h3>Friend Request</h3>
          </div>
          <div className="header_option">
            <BsThreeDotsVertical />
          </div>
        </div>
        <div className="card_body">
          {friendRequest.map((item, i) => (
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
                <div className="sub_name">{item.id}</div>
              </div>
              <div className="btn_group">
                <Button
                  className="primary_btn"
                  variant="contained"
                  size="small"
                  onClick={() => handleAcceptReq(item)}>
                  Accept
                </Button>
                <Button
                  className="primary_btn cancel"
                  variant="contained"
                  size="small"
                  onClick={() => handleCancelReq(item)}>
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FriendRequest;
