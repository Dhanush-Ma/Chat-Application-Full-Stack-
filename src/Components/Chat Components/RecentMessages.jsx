import { useEffect, useCallback, useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsFillImageFill } from "react-icons/bs";
import { Context } from "../../Context/Context";
import {AiFillAudio} from "react-icons/ai"

const RecentMessages = ({ messages }) => {
  const { user, setSelectedChat, selectedChat } = useContext(Context);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log(JSON.parse(xmlhttp.responseText))
        setRecentMessages(JSON.parse(xmlhttp.responseText));
      }
    };

    xmlhttp.open(
      "GET",
      "http://localhost:8089/Chat_Application/recent-messages?userID=" +
        user._id.$oid,
      true
    );
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );

    xmlhttp.send();
  }, [messages]);


  return (
    <>
      {recentMessages.length > 0 &&
        recentMessages.map((message, idx) => (
          <div
            onClick={() => {
              let xmlhttp = new XMLHttpRequest();
              xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                  setSelectedChat(JSON.parse(xmlhttp.response));
                }
              };
              xmlhttp.open(
                "GET",
                "http://localhost:8089/Chat_Application/user?userID=" +
                  message.chatterDetails._id.slice(1, 25),
                true
              );
              xmlhttp.setRequestHeader(
                "Content-type",
                "application/x-www-form-urlencoded"
              );
              xmlhttp.send();
            }}
            key={idx}
            className={`flex justify-start items-center gap-x-3  p-3 rounded-lg mb-5 cursor-pointer hover:bg-blueShade1 transition-all duration-300 ease-in-out ${
              selectedChat?._id.$oid === message._id.slice(1, 25)
                ? "bg-blueShade1"
                : "bg-greyShade1"
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-full relative cursor-pointer">
                {message.chatterDetails.photoURL ? (
                  <img
                    className="w-full h-full object-cover rounded-full border-2"
                    src={message.photoURL}
                    alt=""
                  />
                ) : (
                  <FaUserCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" />
                )}
              </div>
            </div>
            <div>
              <p className="text-2xl">{message.chatterDetails.firstName}</p>
              <p className="text-sm overflow-hidden w-full h-[20px]">
                {message.type === "text" ? (
                  message.messageFromID === user._id.$oid ? (
                    `You: ${message.message}`
                  ) : (
                    `${message.chatterDetails.firstName}: ${message.message}`
                  )
                ) : message.type === "image" ? (
                  <div className="flex gap-x-2 items-center justify-center">
                    <p>
                      {message.messageFromID === user._id.$oid
                        ? `You: `
                        : `${message.chatterDetails.firstName}: `}
                    </p>
                    <BsFillImageFill size={22} />{" "}
                    <span className="italic">Image</span>
                  </div>
                ) : (
                  <div className="flex gap-x-2 items-center justify-center">
                    <p>
                      {message.messageFromID === user._id.$oid
                        ? `You: `
                        : `${message.chatterDetails.firstName}: `}
                    </p>
                    <AiFillAudio size={22} />{" "}
                    <span className="italic">Audio</span>
                  </div>
                )}
              </p>
            </div>
          </div>
        ))}
    </>
  );
};

export default RecentMessages;
