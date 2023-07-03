import React, { useEffect, useState } from "react";
import "./style.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IoIosNotifications } from "react-icons/io";
import { getDatabase, onValue, ref } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { useSelector } from "react-redux";
import moment from "moment/moment";

const Notification = () => {
  const db = getDatabase();
  const storage = getStorage();
  const [userlist, setUserlist] = useState([]);
  const [notification, setNotification] = useState();
  const users = useSelector((user) => user.loginSlice.login);

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

  // Get notification
  useEffect(() => {
    onValue(ref(db, "notification/"), (snap) => {
      let notiArr = [];
      snap.forEach((item) => {
        if (item.val().receiverID === users.uid) {
          let usersList = userlist.find(
            (u) => u?.userID === item.val().senderID
          );
          notiArr.push({
            ...item.val(),
            notifID: item.key,
            notiFrom: usersList?.username,
          });
        }
      });
      setNotification(notiArr);
    });
  }, [userlist]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Notifications</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notification?.map((item, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell className="table-cell">
                <IoIosNotifications />
                {item.notiFrom + " " + item.notice + " to you..!"}
                <span className="noti-time">
                  {"-" + moment(item?.time).fromNow()}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Notification;
