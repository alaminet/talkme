import React, { useState } from "react";
import "./style.css";
import { Grid, IconButton } from "@mui/material";
import { BsThreeDotsVertical, BsCamera } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { AiOutlineAudio } from "react-icons/ai";
import ModalImage from "react-modal-image";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

const ChatBox = () => {
  const [camOpen, setCamOpen] = useState(false);
  const defaultProfile = "./images/avatar_boy_cap.png";
  const speedIcon = [
    { icon: <GrGallery />, name: "Gallery" },
    { icon: <BsCamera onClick={() => setCamOpen(true)} />, name: "Camera" },
    { icon: <AiOutlineAudio />, name: "Audio" },
  ];

  // take photos from camera
  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log(dataUri);
  }

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
                    // autoPlay
                    // loop
                    controls
                    width="100%"
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
            <div className="massage w-50 right">
              <div className="msg">
                <div className="video">
                  <video
                    // autoPlay
                    // loop
                    controls
                    width="100%"
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
            {/* Audio Message */}
            <div className="massage w-50 left">
              <div className="msg">
                <div className="audio">
                  <audio
                    // autoPlay
                    // loop
                    controls>
                    <source src="" type="audio/mpeg" />
                  </audio>
                </div>
              </div>
              <div className="time">today</div>
            </div>
            <div className="massage w-50 right">
              <div className="msg">
                <div className="audio">
                  <audio
                    // autoPlay
                    // loop
                    controls>
                    <source src="" type="audio/mpeg" />
                  </audio>
                </div>
              </div>
              <div className="time">today</div>
            </div>
          </div>
        </Grid>
        <Grid item className="chat-input">
          <div className="input-wrapper">
            <form className="input-form">
              <div className="input-field">
                <input type="text" placeholder="messages" />
              </div>
              <div className="input-btn">
                <IconButton type="submit">
                  <IoMdSend />
                </IconButton>
              </div>
            </form>
            <div className="input-opt">
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}>
                {speedIcon.map((action, i) => (
                  <SpeedDialAction
                    key={i}
                    icon={action.icon}
                    tooltipTitle={action.name}
                  />
                ))}
              </SpeedDial>
            </div>
          </div>
          {camOpen && (
            <div className="camera-opt">
              <div className="camera-wrapper">
                <div className="closed">
                  <IoCloseSharp onClick={() => setCamOpen(false)} />
                </div>
                <Camera
                  onTakePhoto={(dataUri) => {
                    handleTakePhoto(dataUri);
                  }}
                  isImageMirror={true}
                />
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ChatBox;
