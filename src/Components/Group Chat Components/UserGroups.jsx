import React, { useContext, useEffect, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiUserGroup } from "react-icons/hi";
import { Context } from "../../Context/Context";

const UserGroups = () => {
  const {
    setShowAddGroupModal,
    user,
    selectedGroupChat,
    setSelectedGroupChat,
    groupInfo,
    setGroupInfo,
  } = useContext(Context);

  useEffect(() => {
    setGroupInfo([]);
    if (user.groups.length === 0) return;

    user.groups.map((group, idx) => {
      let xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          setGroupInfo((prev) => [...prev, JSON.parse(xmlhttp.responseText)]);
        }
      };

      xmlhttp.open(
        "GET",
        "http://localhost:8089/Chat_Application/groups?groupID=" + group,
        true
      );
      xmlhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );

      xmlhttp.send();
    });
  }, [user.groups]);

  console.log(groupInfo);
  return (
    <div className="h-full w-[50%] flex flex-col justify-start">
      <div
        className="flex items-center justify-between p-4 cursor-pointer bg-blueShade1 rounded-xl mb-5"
        onClick={() => setShowAddGroupModal(true)}
      >
        <p className="text-2xl font-bold">Create Group</p>
        <AiOutlineUsergroupAdd size={30} />
      </div>
      <p className="text-2xl font-bold">Your Groups</p>

      {user.groups.length > 0 && (
        <div className="w-full h-[90%]  mt-5 overflow-y-scroll scrollbar">
          {groupInfo &&
            groupInfo.map((group, idx) => {
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-x-5 p-4 cursor-pointer  hover:bg-blueShade1 rounded-md mb-5 shadow-2xl ${
                    selectedGroupChat?._id.$oid === group._id.$oid
                      ? "bg-blueShade1"
                      : "bg-slate-800"
                  }`}
                  onClick={() => setSelectedGroupChat(group)}
                >
                  <div className="w-14 h-14 rounded-full relative cursor-pointer border-2 ">
                    {group.groupIcon ? (
                      <img
                        className="w-full h-full object-contain rounded-full "
                        src={group.groupIcon}
                        alt=""
                      />
                    ) : (
                      <HiUserGroup
                        size={32}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    )}
                  </div>
                  <p className="text-xl">{group.groupName}</p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default UserGroups;
