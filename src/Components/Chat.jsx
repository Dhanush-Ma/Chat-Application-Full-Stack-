import React, { useContext, useState } from "react";
import Messages from "./Chat Components/Messages";
import SingleChat from "./Chat Components/SingleChat";
import { Context } from "../Context/Context";

const Chat = () => {
  const { selectedChat } = useContext(Context);
  const [messages, setMessages] = useState([]);



  return (
    <div className="pt-10 h-screen flex gap-x-5">
      <Messages messages={messages} />
      {selectedChat ? (
        <SingleChat messages={messages} setMessages={setMessages} />
      ) : (
        <div className="border-2 w-[75%] bg-primaryBg rounded-xl mb-5 mr-5 p-5 flex flex-col justify-between gap-y-5"></div>
      )}
    </div>
  );
};

export default Chat;
