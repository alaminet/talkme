import React from "react";
import "./style.css";
import { Grid } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import ModalImage from "react-modal-image";

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
                    <ModalImage
                      small={"./images/lng.jpg"}
                      medium={"./images/lng.jpg"}
                      alt="Hello World!"
                      showRotate="true"
                    />
                  </picture>
                </div>
              </div>
              <div className="time">today</div>
            </div>
            <div className="massage w-50 right">
              <div className="msg">
                <div className="picture">
                  <picture>
                    <ModalImage
                      small={"./images/sq.jpg"}
                      medium={"./images/sq.jpg"}
                      alt="Hello World!"
                      showRotate="true"
                    />
                  </picture>
                </div>
              </div>
              <div className="time">today</div>
            </div>
            {/* Video massage */}
            <div className="massage w-50 left">
              <div className="msg">
                <div className="video">
                  <video
                    autoPlay
                    loop
                    muted
                    poster="https://assets.codepen.io/6093409/river.jpg">
                    <source
                      src="https://assets.codepen.io/6093409/river.mp4"
                      type="video/mp4"
                    />
                  </video>
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
