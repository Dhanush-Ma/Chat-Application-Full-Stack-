import { useContext, useEffect, useState } from "react";
import { IoChevronBackCircle } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { getCreatedAtTimme } from "../../utilities/formatTime";
import { BsPersonAdd, BsSearch } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import { Context } from "../../Context/Context";

const AddUserModal = ({ setShowAddUserModal, addMember }) => {
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState([]);
  const { user } = useContext(Context);

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
  return (
    <div className="min-w-[300px] w-1/2 h-5/6 rounded-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-10 absolute text-black flex drop-shadow-lg flex-col items-center py-10">
      <div
        className="absolute top-0 right-0 cursor-pointer bg-white p-3 rounded-full"
        onClick={() => setShowAddUserModal(false)}
      >
        <RxCross1 color="#000" size={24} />
      </div>
      <p className="text-xl font-semibold mb-5">Add User</p>
      <div className="relative w-[90%] mb-3">
        <input
          autoComplete="off"
          value={query}
          className="outline-none w-full px-3 pr-12 py-3 rounded-lg bg-primaryBg focus:border-4 focus:border-blueShade1 placeholder:text-red-50 text-white"
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
          <BsSearch
            className="cursor-pointer absolute top-1/2 right-4 -translate-y-1/2"
            color="#fff"
            size="20px"
          />
        )}
        {queryResult.length > 0 && (
          <div className="absolute  h-[430px] overflow-y-scroll scrollbar  rounded-md w-full bg-primaryBg top-[110%] z-10 text-white">
            {queryResult.map((user, idx) => (
              <div
                key={idx}
                onClick={() => {
                  addMember(user);
                  setShowAddUserModal(false);
                }}
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
  );
};
const ErrorModal = ({ title, setShowErrorModal }) => {
  useEffect(() => {
    setTimeout(() => {
      setShowErrorModal(false);
    }, 5000);
  }, []);
  return (
    <div className="absolute bottom-5 bg-red-600 w-max px-4 py-2 rounded-md left-1/2 -translate-x-1/2">
      <p>{title}</p>
    </div>
  );
};

const GroupInfo = ({ setShowGroupInfo, selectedGroupChat }) => {
  let { groupIcon, groupName, createdAt, createdBy, groupMembers, _id } =
    selectedGroupChat;
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [util, setUtil] = useState(null);
  const addMember = (userToAdd) => {
    if (groupMembers.some((member) => member._id === userToAdd._id.$oid)) {
      setShowErrorModal(true);
      return;
    }

    //update to db
    console.log(userToAdd);
    const data = {
      userInfo: {
        _id: userToAdd._id.$oid,
        username: userToAdd.username,
      },
      groupID: _id.$oid,
    };

    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        setUtil(JSON.parse(xmlhttp.responseText));
        groupMembers.push({
          _id: userToAdd._id.$oid,
          username: userToAdd.username,
        });
      }
    };

    xmlhttp.open(
      "POST",
      "http://localhost:8089/Chat_Application/add-member",
      true
    );
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );

    xmlhttp.send(JSON.stringify(data));
  };

  return (
    <>
      <div className="absolute bg-primaryBg w-full h-full rounded-xl top-0 p-5 flex flex-col justify-start">
        {showAddUserModal && (
          <AddUserModal
            setShowAddUserModal={setShowAddUserModal}
            addMember={addMember}
          />
        )}
        {showErrorModal && (
          <ErrorModal
            title={"User is already a member"}
            setShowErrorModal={setShowErrorModal}
          />
        )}
        <IoChevronBackCircle
          size={44}
          onClick={() => setShowGroupInfo(false)}
          className="absolute cursor-pointer"
        />
        <div className="flex flex-col gap-y-5 mb-3 items-center justify-between">
          <div className="w-32 h-32 rounded-full relative border-2">
            {groupIcon ? (
              <img
                className="w-full h-full object-cover rounded-full "
                src={groupIcon}
                alt=""
              />
            ) : (
              <HiUserGroup
                size={32}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            )}
          </div>
          <div className="flex flex-col items-center text-xl font-semibold">
            <p>{groupName}</p>
            <p> {groupMembers.length} Members</p>
          </div>
        </div>
        <div className="flex flex-col mb-3">
          <p>
            Created By:{" "}
            <span className="text-[#e4e6e6] font-bold">@{createdBy}</span>
          </p>
          <p>
            Created At:{" "}
            <span className="text-[#e4e6e6] font-bold">
              {getCreatedAtTimme(createdAt.$numberLong)}
            </span>
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between gap-x-2 border-b-2 pb-2">
            <p className="text-3xl font-semibold">Members</p>
            <BsPersonAdd
              size={32}
              className="cursor-pointer"
              onClick={() => setShowAddUserModal(true)}
            />
          </div>
          <div className="flex flex-col gap-y-2 mt-2 h-[370px] overflow-y-scroll scrollbar">
            {groupMembers.length > 0 &&
              groupMembers.map((member, index) => (
                <div key={index} className="bg-blueShade1 p-2 rounded-md">
                  <p className="text-xl font-semibold">@{member.username}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupInfo;
