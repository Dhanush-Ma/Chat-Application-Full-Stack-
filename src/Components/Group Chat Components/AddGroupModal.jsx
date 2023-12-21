import { useContext, useEffect, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineCamera, AiOutlineUser } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { BsEmojiSmileFill } from "react-icons/bs";
import { Context } from "../../Context/Context";
import EmojiPicker from "emoji-picker-react";

const AddGroupModal = () => {
  const hiddenFileInput = useRef(null);
  const lastMemberRef = useRef(null);

  const { setShowAddGroupModal, user, setUser } = useContext(Context);
  const [queryResult, setQueryResult] = useState([]);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({
    groupName: "",
    groupIcon: "",
    groupMembers: [{ _id: user._id.$oid, username: user.username }],
  });
  const [emojiPicker, setEmojiPicker] = useState(false);

  useEffect(() => {
    lastMemberRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const removeMember = (idx) => {
    setFormData((prev) => {
      return {
        ...prev,
        groupMembers: prev.groupMembers.filter((dept, index) => index != idx),
      };
    });
  };

  const addMember = (userToAdd) => {
    if (formData.groupMembers.some((member) => member._id === userToAdd._id.$oid)) {
      return;
    }

    setFormData((prev) => {
      return {
        ...prev,
        groupMembers: [
          { _id: userToAdd._id.$oid, username: userToAdd.username },
          ...prev.groupMembers,
        ],
      };
    });
  };

  const handleFileChange = (event) => {
    const fileUploaded = event.target.files[0];
    const blob = new Blob([fileUploaded], { type: "image/png" });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      setFormData((prev) => {
        return {
          ...prev,
          groupIcon: reader.result,
        };
      });
    };
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUserSearch = (e) => {
    setQuery(e.target.value);

    if (e.target.value === "") {
      setQueryResult([]);
      return;
    }

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        setQueryResult(
          JSON.parse(xmlhttp.responseText).filter(
            (res) => res._id.$oid !== user._id.$oid
          )
        );
        console.log(JSON.parse(xmlhttp.responseText));
      }
    };

    xmlhttp.open(
      "GET",
      "http://localhost:8089/Chat_Application/users?query=" + e.target.value,
      true
    );
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlhttp.send();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      groupInfo: {
        ...formData,
        createdAt: Date.now(),
        createdBy: user.username,
      },
      id: user._id.$oid,
    };

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        setUser(JSON.parse(xmlhttp.responseText));
        setShowAddGroupModal(false);
      }
    };

    xmlhttp.open("POST", "http://localhost:8089/Chat_Application/groups", true);
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );

    xmlhttp.send(JSON.stringify(data));
    console.log(data);
  };

  return (
    <div className="w-[100%] h-[100%] absolute top-0 left-0 bg-[#000000]/80 z-10 flex justify-center items-center">
      <div className="w-[600px] h-[80%] flex flex-col justify-center border-2 bg-slate-500 bg- rounded-xl px-10 py-5 relative text-center">
        <div
          className="absolute -top-5  -right-5  cursor-pointer bg-white p-3 rounded-full"
          onClick={() => setShowAddGroupModal(false)}
        >
          <RxCross1 color="#000" size={24} />
        </div>
        <p className="text-2xl font-bold mb-5">Tell us about your group.</p>
        <form
          className="flex
        flex-col items-center"
        >
          <div className="flex flex-col justify-center items-center gap-y-2">
            <div
              className="w-24 h-24 rounded-full bg-primaryBg flex justify-center items-center cursor-pointer"
              onClick={() => hiddenFileInput.current.click()}
            >
              {formData.groupIcon ? (
                <img
                  src={formData.groupIcon}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <AiOutlineCamera size={32} />
              )}
              <input
                ref={hiddenFileInput}
                onChange={handleFileChange}
                style={{ display: "none" }}
                type="file"
              />
            </div>
            <p>
              Add group icon <span className="italic">(optional)</span>
            </p>
          </div>
          <div className="mt-5 flex flex-col items-center w-[400px]">
            <div className="relative w-full h-full mb-3">
              {emojiPicker && (
                <div className="w-max top-[110%] mb-5 absolute  right-0 z-10">
                  <EmojiPicker
                    height={350}
                    onEmojiClick={(emoji) => {
                      setFormData((prev) => ({
                        ...prev,
                        groupName: prev.groupName + emoji.emoji,
                      }));
                    }}
                  />
                </div>
              )}
              <input
                autoComplete="off"
                value={formData.groupName}
                className="outline-none w-full px-3 pr-12 py-3 rounded-lg bg-primaryBg focus:border-4 focus:border-blueShade1 placeholder:text-red-50"
                type="text"
                name="groupName"
                placeholder="Group Name"
                onChange={(e) => handleChange(e)}
              />
              <BsEmojiSmileFill
                onClick={() => setEmojiPicker(!emojiPicker)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                color="#fff"
                size="20px"
              />
            </div>
            {formData.groupMembers.length > 0 && (
              <div
                ref={lastMemberRef}
                className="scrollbar flex gap-x-2 overflow-x-scroll pb-1 w-full h-full mb-1"
              >
                {formData.groupMembers.map((groupuser, idx) => (
                  <div
                    key={idx}
                    className="flex  justify-center items-center gap-x-2 bg-gradient-to-r from-[#cc2b5e] to-[#753a88] px-3 py-[4px] rounded-md"
                  >
                    <p>@{groupuser.username}</p>
                    {!(user._id.$oid === groupuser._id) && (
                      <RxCross1
                        className="cursor-pointer"
                        onClick={() => removeMember(idx)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="relative w-full mb-3">
              <input
                autoComplete="off"
                value={query}
                className="outline-none w-full px-3 pr-12 py-3 rounded-lg bg-primaryBg focus:border-4 focus:border-blueShade1 placeholder:text-red-50"
                type="text"
                name="username"
                placeholder="Add Members"
                onChange={(e) => handleUserSearch(e)}
              />
              {queryResult.length > 0 ? (
                <RxCross1
                  onClick={() => {
                    setQuery("");
                    setQueryResult([]);
                  }}
                  className="cursor-pointer absolute top-1/2 right-4 -translate-y-1/2"
                  color="#fff"
                  size="20px"
                />
              ) : (
                <AiOutlineUser
                  className="cursor-pointer absolute top-1/2 right-4 -translate-y-1/2"
                  color="#fff"
                  size="20px"
                />
              )}
              {queryResult.length > 0 && (
                <div className="absolute h-[240px] overflow-y-scroll scrollbar  rounded-md w-full bg-primaryBg top-[110%] z-10">
                  {queryResult.map((user, idx) => (
                    <div
                      key={idx}
                      onClick={() => addMember(user)}
                      className="flex justify-start items-center gap-x-3 bg-greyShade p-3 rounded- mb-5 cursor-pointer hover:bg-[#565584]"
                      s
                    >
                      <div>
                        <div className="w-14 h-14 rounded-full relative cursor-pointer">
                          {user.photoURL ? (
                            <img
                              className="w-full h-full object-contain rounded-full border-2"
                              src={user.photoURL}
                              alt=""
                            />
                          ) : (
                            <FaUserCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xl">@{user.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            disabled={formData.groupName.length < 1}
            onClick={handleSubmit}
            className="py-3 cursor-pointer bg-purple-500 rounded-md mb-5 w-[400px] mt-auto disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <p className="font-bold tracking-widest text-white ">CONFIRM</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;

// {565584}
