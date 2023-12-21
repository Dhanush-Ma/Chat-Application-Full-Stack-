import { useContext, useEffect } from "react";
import { Context } from "../Context/Context";
import getUser from "../utilities/getUser";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
import AddGroupModal from "../Components/Group Chat Components/AddGroupModal";

const Home = () => {
  const { user, setUser, showAddGroupModal } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("token") && user == null) {
      getUser(setUser);
    }
  });
  return (
    <>
      {user && (
        <div className="bg-primaryBg/40 h-screen w-screen relative">
          <Navbar />
          <div className="ml-28">
            <Outlet />
          </div>
          {showAddGroupModal &&<AddGroupModal />}
        </div>
      )}
    </>
  );
};

export default Home;
