import React, { createContext, useEffect, useState } from "react";
import socketio from "socket.io-client";

export const Context = createContext();
// export const socket = socketio.connect("http://localhost:4000");

const ContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedGroupChat, setSelectedGroupChat] = useState(null);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) setSocket(socketio.connect(`http://localhost:4000`));
  }, [user]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        selectedGroupChat,
        setSelectedGroupChat,
        showAddGroupModal,
        setShowAddGroupModal,
        groupInfo,
        setGroupInfo,
        // recentMessages,
        // setRecentMessages,
        socket,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
