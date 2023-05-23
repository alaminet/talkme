import React from "react";
import "./style.css";
import { Grid } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";

const ChatBox = () => {
  const defaultProfile = "./images/avatar_boy_cap.png";
  return (
    <>
      <Grid
        height="100vh"
        p={3}
        container
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start">
        <Grid item className="chat-header">
          <div className="chat-header-wrapper">
            <div className="header_info">
              <div className="head-picture">
                <div className="status"></div>
                <div className="user_pic_70">
                  <picture>
                    <img src={defaultProfile} alt="profile-pic" />
                  </picture>
                </div>
              </div>
              <div className="user_info">
                <div className="name">Name</div>
                <div className="sub_name">Online</div>
              </div>
            </div>
            <div className="header_option">
              <BsThreeDotsVertical />
            </div>
          </div>
        </Grid>
        <Grid item className="chat-body">
          <div className="chat-body-wrapper">
            {/* text message */}
            <div className="massage w-50 left">
              <div className="msg">
                <div className="text">Lorem Ipsum</div>
              </div>
              <div className="time">today</div>
            </div>
            <div className="massage w-50 right">
              <div className="msg">
                <div className="text">Lorem Ipsum</div>
              </div>
              <div className="time">today</div>
            </div>
            {/* picture massage */}
            <div className="massage w-50 left">
              <div className="msg">
                <div className="picture">
                  <picture>
                    <img src="./images/lng.jpg" alt="" />
                  </picture>
                </div>
              </div>
              <div className="time">today</div>
            </div>
            <div className="massage w-50 right">
              <div className="msg">
                <div className="picture">
                  <picture>
                    <img src="./images/sq.jpg" alt="" />
                  </picture>
                </div>
              </div>
              <div className="time">today</div>
            </div>
          </div>
        </Grid>
        <Grid item className="chat-input">
          input
        </Grid>
      </Grid>
    </>
  );
};

export default ChatBox;
