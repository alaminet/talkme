import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Grid, IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ToastContainer, toast } from "react-toastify";
import { BsThreeDotsVertical, BsCamera } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { MdSend } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { GrGallery } from "react-icons/gr";
import { AiOutlineAudio } from "react-icons/ai";
import ModalImage from "react-modal-image";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useSelector } from "react-redux";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import moment from "moment/moment";
import { v4 as uuidv4 } from "uuid";
import { AudioRecorder } from "react-audio-voice-recorder";

const ChatBox = () => {
  const db = getDatabase();
  const storage = getStorage();
  const scrollMsg = useRef(null);
  const [camOpen, setCamOpen] = useState(false);
  const [audioRec, setAudioRec] = useState(false);
  const [msgSend, setMsgSend] = useState("");
  const [textMsg, setTextMsg] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [blobs, setBlob] = useState("");
  const [onlineUser, setOnlineUser] = useState([]);
  const [capter, setCapter] = useState(null);
  const [modalOpen, SetModalOpen] = useState(false);
  const users = useSelector((user) => user.loginSlice.login);
  const activeSingleChat = useSelector(
    (state) => state.activeSlice.activeSingle
  );
  const defaultProfile = "./images/avatar_boy_cap.png";

  // take photos from camera
  function handleTakePhoto(dataUri) {
    setCapter(dataUri);
    SetModalOpen(true);
  }

  // Input gallery image
  const handleGalleryInput = (e) => {
    if (activeSingleChat?.status == "single") {
      uploadBytes(
        storageRef(storage, "singleMsgPic/" + uuidv4()),
        e.target.files[0]
      )
        .then((snapshot) => {
          getDownloadURL(storageRef(storage, snapshot.metadata.fullPath)).then(
            (url) => {
              set(push(ref(db, "singleChat")), {
                chatSend: users?.uid,
                chatReceive: activeSingleChat?.userID,
                picMsg: url,
                time: `${new Date()}`,
              });
            }
          );
        })
        .catch((error) => {
          console.log(error.code);
        });
    } else {
      console.log("for group msg");
    }
  };

  // Send Message from input box
  const handleEnterPress = (e) => {
    e.key === "Enter" && handleSubmit();
  };
  const handleSubmit = () => {
    if (activeSingleChat?.status == "single") {
      if (msgSend !== "") {
        set(push(ref(db, "singleChat")), {
          chatSend: users.uid,
          chatReceive: activeSingleChat?.userID,
          msg: msgSend,
          time: `${new Date()}`,
        }).then(() => {
          setMsgSend("");
        });
      }
    } else {
      console.log("for group msg");
    }
  };

  // Send Camera Capter from input speeddail
  const handleCaptureSend = () => {
    if (activeSingleChat?.status == "single") {
      if (capter !== null) {
        uploadString(
          storageRef(storage, "singleMsgPic/" + uuidv4()),
          capter,
          "data_url"
        ).then((snapshot) => {
          SetModalOpen(false);
          setCamOpen(false);
          getDownloadURL(storageRef(storage, snapshot.metadata.fullPath))
            .then((url) => {
              set(push(ref(db, "singleChat")), {
                chatSend: users?.uid,
                chatReceive: activeSingleChat?.userID,
                picMsg: url,
                time: `${new Date()}`,
              }).then(() => {
                setCapter(null);
              });
            })
            .catch((error) => {
              console.log(error.code);
            });
        });
      }
    } else {
      console.log("for group msg");
    }
  };

  // Send record audio file
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setBlob(blob);
  };

  const handleAudioUpload = () => {
    const audioStgRef = storageRef(storage, audioUrl);
    uploadBytes(audioStgRef, blobs).then(() => {
      getDownloadURL(audioStgRef).then((downloadURL) => {
        set(push(ref(db, "singleChat")), {
          chatSend: users?.uid,
          chatReceive: activeSingleChat?.userID,
          recMsg: downloadURL,
          time: `${new Date()}`,
        });
      });
      setAudioRec(false);
    });
  };

  // const addAudioElement = (blob) => {
  //   const url = URL.createObjectURL(blob);
  //   setAudioUrl(url);
  //   setBlob(blob);
  //   if (activeSingleChat?.status == "single") {
  //     const audioStgRef = storageRef(storage, audioUrl);
  //     uploadBytes(audioStgRef, blob).then(() => {
  //       getDownloadURL(audioStgRef)
  //         .then((downloadURL) => {
  //           set(push(ref(db, "singleChat")), {
  //             chatSend: users?.uid,
  //             chatReceive: activeSingleChat?.userID,
  //             recMsg: downloadURL,
  //             time: `${new Date()}`,
  //           }).then(() => {
  //             setAudioRec(false);
  //           });
  //         })
  //         .catch((error) => {
  //           console.log(error.code);
  //         });
  //     });
  //   } else {
  //     console.log("for group msg");
  //   }
  // };

  // Read msg from database
  useEffect(() => {
    onValue(ref(db, "singleChat/"), (snapshot) => {
      let singleMsgArr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().chatSend == users?.uid &&
            item.val().chatReceive == activeSingleChat?.userID) ||
          (item.val().chatSend == activeSingleChat?.userID &&
            item.val().chatReceive == users?.uid)
        ) {
          singleMsgArr.push({ ...item.val(), msgID: item.key });
        }
        setTextMsg(singleMsgArr);
      });
    });
  }, [activeSingleChat]);

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

  // Scroll Message
  useEffect(() => {
    scrollMsg.current?.scrollIntoView({ behavior: "smooth" });
  }, [textMsg]);

  // Speed icons
  const speedIcon = [
    {
      icon: (
        <>
          <label>
            <GrGallery />
            <input
              hidden
              onChange={handleGalleryInput}
              type="file"
              accept="image/*,  video/*"
            />
          </label>
        </>
      ),
      name: "Gallery",
    },
    {
      icon: <BsCamera onClick={() => setCamOpen(true)} />,
      name: "Camera",
    },
    {
      icon: <AiOutlineAudio onClick={() => setAudioRec(true)} />,
      name: "Audio",
    },
  ];

  return (
    <>
      <ToastContainer />
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
                {onlineUser.includes(activeSingleChat?.userID) && (
                  <div className="status"></div>
                )}

                <div className="user_pic_70">
                  <picture>
                    <img
                      src={activeSingleChat?.userPic ?? defaultProfile}
                      alt={activeSingleChat?.username}
                    />
                  </picture>
                </div>
              </div>
              <div className="user_info">
                <div className="name">{activeSingleChat?.username}</div>
                <div className="sub_name">
                  {onlineUser.includes(activeSingleChat?.userID)
                    ? "Online"
                    : "Offline"}
                </div>
              </div>
            </div>
            <div className="header_option">
              <BsThreeDotsVertical />
            </div>
          </div>
        </Grid>
        <Grid item className="chat-body">
          <div className="chat-body-wrapper">
            {activeSingleChat?.status == "single"
              ? textMsg?.map((item, i) => (
                  <div key={i} ref={scrollMsg}>
                    {item.chatSend == activeSingleChat?.userID ? (
                      item?.msg ? (
                        <>
                          <div className="massage w-50 left">
                            <div className="msg">
                              <div className="text">{item?.msg}</div>
                            </div>
                            <div className="time">
                              {moment(item?.time).fromNow()}
                            </div>
                          </div>
                        </>
                      ) : item?.picMsg ? (
                        <div className="massage w-50 left">
                          <div className="msg">
                            <div className="picture">
                              <picture>
                                <ModalImage
                                  small={item?.picMsg}
                                  medium={item?.picMsg}
                                  alt=""
                                  showRotate="true"
                                />
                              </picture>
                            </div>
                          </div>
                          <div className="time">
                            {moment(item?.time).fromNow()}
                          </div>
                        </div>
                      ) : item?.recMsg ? (
                        <div className="massage w-50 left">
                          <div className="msg">
                            <div className="audio">
                              <audio controls src={item?.recMsg}></audio>
                            </div>
                          </div>
                          <div className="time">
                            {moment(item?.time).fromNow()}
                          </div>
                        </div>
                      ) : (
                        "VedoMsg"
                      )
                    ) : item?.msg ? (
                      <>
                        <div className="massage w-50 right">
                          <div className="msg">
                            <div className="text">{item?.msg}</div>
                          </div>
                          <div className="time">
                            {moment(item?.time).fromNow()}
                          </div>
                        </div>
                      </>
                    ) : item?.picMsg ? (
                      <div className="massage w-50 right">
                        <div className="msg">
                          <div className="picture">
                            <picture>
                              <ModalImage
                                small={item?.picMsg}
                                medium={item?.picMsg}
                                alt=""
                                showRotate="true"
                              />
                            </picture>
                          </div>
                        </div>
                        <div className="time">
                          {moment(item?.time).fromNow()}
                        </div>
                      </div>
                    ) : item?.recMsg ? (
                      <div className="massage w-50 right">
                        <div className="msg">
                          <div className="audio">
                            <audio controls src={item?.recMsg}></audio>
                          </div>
                        </div>
                        <div className="time">
                          {moment(item?.time).fromNow()}
                        </div>
                      </div>
                    ) : (
                      "videoMsg"
                    )}
                  </div>
                ))
              : "Group msg"}
            {/* text message */}
            {/* <div className="massage w-50 left">
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
            </div> */}
            {/* picture massage */}
            {/* <div className="massage w-50 left">
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
            </div> */}
            {/* Video massage */}
            {/* <div className="massage w-50 left">
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
            </div> */}
            {/* Audio Message */}
            {/* <div className="massage w-50 left">
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
            </div> */}
          </div>
        </Grid>
        <Grid item className="chat-input">
          <div className="input-wrapper">
            <div className="input-form">
              <div className="input-field">
                <input
                  type="text"
                  placeholder="messages"
                  value={msgSend}
                  onKeyUp={handleEnterPress}
                  onChange={(e) => setMsgSend(e.target.value)}
                />
                {audioRec && (
                  <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    audioTrackConstraints={{
                      noiseSuppression: true,
                      echoCancellation: true,
                    }}
                    showVisualizer={true}
                    downloadFileExtension="mp3"
                  />
                )}
              </div>
              <div className="input-btn">
                <IconButton
                  onClick={audioUrl ? handleAudioUpload : handleSubmit}>
                  <IoMdSend />
                </IconButton>
              </div>
            </div>
            <div className="input-opt">
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}>
                {speedIcon.map((action, j) => (
                  <SpeedDialAction
                    key={j}
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
          {/* Modal for Capter image by webcam */}
          {capter && (
            <Modal open={modalOpen} onClose={() => SetModalOpen(false)}>
              <Box className="box-modal">
                <div className="capter-img">
                  <picture>
                    <img src={capter} alt="" />
                  </picture>
                </div>
                <div>
                  <Stack direction="row" spacing={2}>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => SetModalOpen(false)}
                      startIcon={<MdDeleteForever />}>
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleCaptureSend}
                      endIcon={<MdSend />}>
                      Send
                    </Button>
                  </Stack>
                </div>
              </Box>
            </Modal>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ChatBox;
