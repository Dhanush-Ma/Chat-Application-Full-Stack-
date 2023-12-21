import { useState } from "react";
import { GoSearch } from "react-icons/go";
import Search from "./Search";
import RecentMessages from "./RecentMessages";

const Messages = ({ messages }) => {
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  return (
    <div className="h-full w-[50%]">
      <div className="flex justify-between items-center mb-10">
        <p className="text-5xl font-bold">Chats</p>
        <GoSearch
          size={36}
          className="cursor-pointer"
          onClick={() => setShowSearchDialog(true)}
        />
      </div>
      {showSearchDialog ? (
        <Search setShowSearchDialog={setShowSearchDialog} />
      ) : (
        <div>
          <p className="text-greyShade2 text-lg mb-5">Messages</p>
          <div className="overflow-y-scroll h-[77vh] pr-2 scrollbar">
            <RecentMessages messages={messages} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
