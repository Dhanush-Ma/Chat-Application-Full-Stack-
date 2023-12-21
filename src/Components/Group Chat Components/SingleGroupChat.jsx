import { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../../Context/Context";
import { HiUserGroup } from "react-icons/hi";
import { ImAttachment } from "react-icons/im";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import formatTime from "../../utilities/formatTime";
import EmojiPicker from "emoji-picker-react";
import generateUniqueString from "../../utilities/getUniqueString";
import ShowImage from "../Chat Components/ShowImage";
import { AiFillInfoCircle } from "react-icons/ai";
import GroupInfo from "./GroupInfo";
import getChatBackup from "../../utilities/getChatBackup";
import Image from "../Chat Components/Image";

const SingleGroupChat = ({ groupID }) => {
  const [message, setMessage] = useState("");
  const [imageSelected, setImageSelected] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedGroupChat, setSelectedGroupChat] = useState(null);
  const { selectedChat, user, socket } = useContext(Context);

  const lastMessageRef = useRef(null);
  const hiddenFileInput = useRef(null);

  const sendMessageToServer = (flag) => {
    if (flag === "image") {
      const msgObj = {
        id: user._id.$oid,
        name: `${user.firstName} ${user.lastName}`,
        message: imageSelected,
        photoURL: user.photoURL,
        time: Date.now(),
        to: groupID,
        type: "image",
      };

      socket.emit(
        "chat-message",
        { message: msgObj, chatType: "group" },
        groupID
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
        to: groupID,
        type: "text",
      };

      socket.emit(
        "chat-message",
        { message: msgObj, chatType: "group" },
        groupID
      );

      setMessage("");
    }
  };

  useEffect(() => {
    setShowGroupInfo(false);

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        setSelectedGroupChat(JSON.parse(xmlhttp.responseText));
      }
    };

    xmlhttp.open(
      "GET",
      "http://localhost:8089/Chat_Application/groups?groupID=" + groupID,
      true
    );
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );

    xmlhttp.send();
  }, [groupID]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.emit("join-room", groupID);

    socket.on("chat-message", (msg) => {
      console.log("here at the effect", msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  useEffect(() => {
    getChatBackup(groupID, setMessages);
  }, [groupID]);

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
    <>
      {selectedGroupChat && (
        <div className="border-2 w-[75%] bg-primaryBg rounded-xl mb-5 mr-5 relative ">
          <div className="p-5 w-full h-full bg-primaryBg rounded-xl flex flex-col justify-between gap-y-5">
            <div className="flex justify-between items-center gap-x-5">
              <div className="flex items-center gap-x-2">
                <div className="w-14 h-14 rounded-full relative cursor-pointer border-2">
                  {selectedGroupChat.groupIcon ? (
                    <img
                      className="w-full h-full object-contain rounded-full "
                      src={selectedGroupChat.groupIcon}
                      alt=""
                    />
                  ) : (
                    <HiUserGroup
                      size={32}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {selectedGroupChat.groupName}
                  </p>
                  <p className="text-sm flex items-center gap-x-2 italic font-semibold">
                    {selectedGroupChat.groupMembers.length} members
                  </p>
                </div>
              </div>
              <AiFillInfoCircle
                size={38}
                className="cursor-pointer"
                onClick={() => {
                  setShowGroupInfo(true);
                }}
              />
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
                      {item.id === user._id.$oid
                        ? "You"
                        : item.name.split(" ")[0]}
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
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (emojiPicker) setEmojiPicker(false);
                      sendMessageToServer();
                    }
                  }}
                  value={message}
                  className="outline-none w-full px-3 pr-[7.5rem] border-2 py-5 rounded-lg bg-greyShade1 "
                  type="text"
                  name="username"
                  placeholder="Type something..."
                  onChange={(e) => handleChange(e)}
                />
                <div className="absolute top-1/2 right-4 -translate-y-1/2 flex gap-x-8">
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
          {showGroupInfo && (
            <GroupInfo
              setShowGroupInfo={setShowGroupInfo}
              selectedGroupChat={selectedGroupChat}
            />
          )}
        </div>
      )}
    </>
  );
};

export default SingleGroupChat;
