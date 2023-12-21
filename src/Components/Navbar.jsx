import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";
import { BiMessageDetail, BiLogOut } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiUserGroup } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  return (
    <div className="w-24 fixed left-0 top-0 h-full  justify-between items-center flex flex-col py-10 ">
      <div className="w-14 h-14 rounded-full  border-gray-400 border-2">
        {/* <div className="w-full h-full rounded-full relative cursor-pointer"> */}
          {user.photoURL ? (
            <img
              className="w-full h-full object-cover rounded-full border-2"
              src={user.photoURL}
              alt=""
            />
          ) : (
            <FaUserCircle className="w-full h-full object-contain rounded-full" />
          )}
        {/* </div> */}
      </div>
      <div className="flex flex-col  w-full items-center">
        <NavLink to="home" exact activeClassName="" className="py-4">
          <BiMessageDetail size={34} />
        </NavLink>
        {/* <NavLink className="py-4" to="notifications" exact>
          <IoMdNotificationsOutline size={34} />
        </NavLink> */}
        <NavLink className="py-4" to="group-chat" exact>
          <HiUserGroup size={34} />
        </NavLink>
      </div>
      <div className="">
        <BiLogOut
          size={34}
          className="cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
