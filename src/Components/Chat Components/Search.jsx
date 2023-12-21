import { useState, useRef, useEffect, useContext } from "react";
import { ImCross } from "react-icons/im";
import { React } from "react";
import { FaUserCircle } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { Context } from "../../Context/Context";

const Search = ({ setShowSearchDialog }) => {
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState([]);
  const { setSelectedChat, user } = useContext(Context);

  const searchRef = useRef();

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  const handleChange = (e) => {
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
    <div>
      <div className="relative">
        <input
          autoComplete="off"
          ref={searchRef}
          value={query}
          className="outline-none w-full  px-3 pr-12 py-3 rounded-lg bg-greyShade1 focus:border-4 focus:border-blueShade1"
          type="text"
          name="username"
          placeholder="Search for a user"
          onChange={(e) => handleChange(e)}
        />
        <ImCross
          onClick={() => setShowSearchDialog(false)}
          className="cursor-pointer absolute top-1/2 right-4 -translate-y-1/2"
          color="#fff"
          size="20px"
        />
      </div>
      <div className="mt-5 h-[73.5vh] overflow-y-scroll scrollbar pr-2">
        {queryResult.length > 0 ? (
          queryResult.map((user, idx) => (
            <div 
              key={idx}
              className="flex justify-start items-center gap-x-3 bg-greyShade p-3 rounded-lg mb-5 cursor-pointer"
              onClick={() => setSelectedChat(user)}
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
          ))
        ) : query.length > 0 ? (
          <div className="flex justify-center items-center gap-x-3 my-auto h-full p-3 rounded-lg">
            <RiErrorWarningLine size={64} />
            <p className="text-3xl">No Users found</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Search;
