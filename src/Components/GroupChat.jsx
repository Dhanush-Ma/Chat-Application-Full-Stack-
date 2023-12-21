import { useContext } from "react";
import { Context } from "../Context/Context";
import UserGroups from "./Group Chat Components/UserGroups";
import SingleGroupChat from "./Group Chat Components/SingleGroupChat";

const GroupChat = () => {
  const { selectedGroupChat } = useContext(Context);

  return (
    <div className="pt-10 h-screen flex gap-x-5">
      <UserGroups />
      {selectedGroupChat ? (
        <SingleGroupChat groupID={selectedGroupChat._id.$oid} />
      ) : (
        <div className="border-2 w-[75%] bg-primaryBg rounded-xl mb-5 mr-5 p-5 flex flex-col justify-between gap-y-5"></div>
      )}
    </div>
  );
};

export default GroupChat;
