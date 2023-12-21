import { useContext, useEffect, useState, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { AiFillAudio } from "react-icons/ai";
import { Context } from "../../Context/Context";
import formatTime from "../../utilities/formatTime";
import generateUniqueString from "../../utilities/getUniqueString";
import getChatBackup from "../../utilities/getChatBackup";
import { Bars } from "react-loader-spinner";
import ShowImage from "./ShowImage";
import Image from "./Image";
import ReactAudioPlayer from "react-audio-player";

const SingleChat = ({ messages, setMessages }) => {
  const [message, setMessage] = useState("");
  const [imageSelected, setImageSelected] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const { selectedChat, user, socket } = useContext(Context);
  const { firstName, lastName } = selectedChat;
  const lastMessageRef = useRef(null);
  const hiddenFileInput = useRef(null);

  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const mimeType = "audio/webm";

  const startRecording = async () => {
    setRecording(true);
    // setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    if ("MediaRecorder" in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event.data);
        };
        setStream(stream);
        setAudioChunks(localAudioChunks);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const stopRecording = () => {
    setRecording(false);

    stream.getTracks().forEach(function (track) {
      track.stop();
    });
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onload = () => {
        // setAudio(reader.result);
        setAudioChunks();

        sendMessageToServer("audio", reader.result);
      };
    };
  };

  //
  const sendMessageToServer = (flag, audioObj) => {
    if (flag === "image") {
      console.log("flag", flag);
      const msgObj = {
        id: user._id.$oid,
        name: `${user.firstName} ${user.lastName}`,
        message: imageSelected,
        photoURL: user.photoURL,
        time: Date.now(),
        to: selectedChat._id.$oid,
        type: "image",
      };

      socket.emit(
        "chat-message",
        {
          message: msgObj,
          chatType: "single",
          users: [user._id.$oid, selectedChat._id.$oid],
        },
        generateUniqueString(user._id.$oid, selectedChat._id.$oid)
      );

      setImageSelected(null);
      return;
    }

    if (flag === "audio") {
      const msgObj = {
        id: user._id.$oid,
        name: `${user.firstName} ${user.lastName}`,
        message: audioObj,
        photoURL: user.photoURL,
        time: Date.now(),
        to: selectedChat._id.$oid,
        type: "audio",
      };

      socket.emit(
        "chat-message",
        {
          message: msgObj,
          chatType: "single",
          users: [user._id.$oid, selectedChat._id.$oid],
        },
        generateUniqueString(user._id.$oid, selectedChat._id.$oid)
      );

      setImageSelected(null);
      return;
    }

    if (message) {
      const msgObj = {
        id: user._id.$oid,
        name: `${user.firstName} ${user.lastName}`,
        message: message,
        photoURL: user.photoURL,
        time: Date.now(),
        to: selectedChat._id.$oid,
        type: "text",
      };

      socket.emit(
        "chat-message",
        {
          message: msgObj,
          chatType: "single",
          users: [user._id.$oid, selectedChat._id.$oid],
        },
        generateUniqueString(user._id.$oid, selectedChat._id.$oid)
      );

      setMessage("");
    }
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    socket.emit(
      "join-room",
      generateUniqueString(user._id.$oid, selectedChat._id.$oid)
    );

    socket.on("chat-message", (msg) => {
      console.log("here at the effect", msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  useEffect(() => {
    getChatBackup(
      generateUniqueString(user._id.$oid, selectedChat._id.$oid),
      setMessages
    );
  }, [selectedChat]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFile = () => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = (event) => {
    const fileUploaded = event.target.files[0];
    const blob = new Blob([fileUploaded], { type: "image/png" });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      console.log(typeof reader.result);
      setImageSelected(reader.result);
      setImagePreview(fileUploaded);
    };
  };

  return (
    <div className="border-2 w-[75%] bg-primaryBg rounded-xl mb-5 mr-5 relative">
      <div className="p-5 w-full h-full bg-primaryBg rounded-xl flex flex-col justify-between gap-y-5">
        <div className="flex justify-start items-center gap-x-5">
          <div className="w-14 h-14 rounded-full relative cursor-pointer">
            <FaUserCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" />
          </div>
          <div className="">
            <p className="text-lg font-semibold">{`${firstName} ${lastName}`}</p>
            <p className="text-sm flex items-center gap-x-2">
              Online <span className="text-green-600 text-[30px]">•</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col h-max overflow-y-scroll scrollbar justify-self-end mt-auto">
          {messages.map((item, idx) => (
            <div
              ref={lastMessageRef}
              key={idx}
              className={`
                ${
                  item.id === user._id.$oid ? "ml-auto" : "mr-auto"
                } px-3 py-3 w-max`}
            >
              {item.type === "image" ? (
                <div
                  className={`w-[300px] h-[300px]]  ${
                    item.id === user._id.$oid
                      ? "bg-blueShade1 p-[4px] rounded-md ml-auto"
                      : "bg-slate-800 p-[4px] rounded-md mr-auto"
                  }`}
                >
                  <Image data={item.message} />
                </div>
              ) : item.type === "audio" ? (
                <div className="w-[300px] h-[50px]">
                  <audio
                    src={item.message}
                    className={`w-full h-full border-4 rounded-full ${
                      item.id === user._id.$oid
                        ? "border-blueShade1 ml-auto"
                        : "border-slate-800 mr-auto"
                    }`}
                    controls
                  />
                </div>
              ) : (
                <div
                  className={`
                ${
                  item.id === user._id.$oid
                    ? "bg-blueShade1 rounded-2xl rounded-br-none ml-auto"
                    : "bg-slate-800 rounded-2xl rounded-bl-none mr-auto"
                } px-3 py-3 w-max  max-w-[320px]`}
                >
                  {item.message}
                </div>
              )}
              <div
                className={`
                ${
                  item.id === user._id.$oid ? "ml-auto" : "mr-auto"
                } flex items-center mt-1 w-max`}
              >
                <div className="w-4 h-4 rounded-full relative cursor-pointer">
                  {item.photoURL ? (
                    <img
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full object-contain border-[1px]"
                      src={item.photoURL}
                    />
                  ) : (
                    <FaUserCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" />
                  )}
                </div>
                <p className="mx-[6px]">
                  {item.id === user._id.$oid ? "You" : item.name.split(" ")[0]}
                </p>
                <p className="text-greyShade3">{formatTime(item.time)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative">
          {emojiPicker && (
            <div className="w-max ml-auto mb-5 absolute bottom-[90%] right-0">
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setMessage(message + emoji.emoji);
                }}
              />
            </div>
          )}
          <div className="relative">
            <input
              r
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (emojiPicker) setEmojiPicker(false);
                  sendMessageToServer();
                }
              }}
              value={message}
              className="outline-none w-full px-3 pr-[9.5rem] border-2  rounded-lg h-[4rem] bg-greyShade1 resize-none scrollbar"
              type="textarea"
              name="username"
              placeholder="Type something..."
              onChange={(e) => handleChange(e)}
            />
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex gap-x-5">
              <BsEmojiSmileFill
                className="cursor-pointer "
                color="#fff"
                size="30px"
                onClick={() => setEmojiPicker((prev) => !prev)}
              />
              <ImAttachment
                onClick={handleFile}
                className="cursor-pointer "
                color="#fff"
                size="30px"
              />
              {recording ? (
                <div className="cursor-pointer" onClick={() => stopRecording()}>
                  <Bars
                    height="30"
                    width="30"
                    color="#4fa94d"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              ) : (
                <AiFillAudio
                  onClick={() => {
                    startRecording();
                  }}
                  className="cursor-pointer "
                  color="#fff"
                  size="30px"
                />
              )}
              <input
                ref={hiddenFileInput}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                type="file"
              />
            </div>
          </div>
        </div>
      </div>
      {imageSelected && (
        <ShowImage
          setImageSelected={setImageSelected}
          imagePreview={imagePreview}
          handleFile={handleFile}
          sendMessageToServer={sendMessageToServer}
        />
      )}
    </div>
  );
};

export default SingleChat;
