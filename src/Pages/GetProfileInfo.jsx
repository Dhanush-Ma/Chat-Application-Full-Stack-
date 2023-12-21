import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";
import styles from "../Stylesheet/Login.module.css";
import { FaUserCircle } from "../../../inventory-app/src/utilities/IconsImport";
import { AiTwotoneEdit } from "react-icons/ai";
import { Oval } from "react-loader-spinner";

const GetProfileInfo = () => {
  const { setUser, user } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgSelected, setImgSelected] = useState(null);
  const [imgOption, setImgOption] = useState(false);

  const navigate = useNavigate();

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setImgSrc(URL.createObjectURL(fileUploaded));
    setImgSelected(fileUploaded);
  };

  const submitImage = () => {
    const formData = new FormData();
    formData.append("file", imgSelected);
    formData.append("upload_preset", "cx1clepy");

    setLoading(true);
    fetch("https://api.cloudinary.com/v1_1/ds1dp3lrx/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((response) => {
        setLoading(false);
        let xmlhttp = new XMLHttpRequest();
        const data = `userID=${user._id.$oid}&photoURL=${response.secure_url}`;
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            setUser(JSON.parse(this.responseText));
            navigate("/home");
          }
        };

        xmlhttp.open(
          "POST",
          "http://localhost:8089/Chat_Application/profile",
          true
        );
        xmlhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xmlhttp.send(data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (user === null) navigate("/register");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className="font-bold text-4xl mb-5">Welcome</h1>
        <p className="text-lg">Add a profile picture!</p>
        <form className="flex flex-col gap-y-5 my-8 items-center text-greyShade2 w-96">
          <div
          className="w-56 h-56 rounded-full relative cursor-pointer"
            onMouseEnter={() => setImgOption(true)}
            onMouseLeave={() => setImgOption(false)}
            onClick={handleClick}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                className="rounded-full border-2 object-contain w-full h-full"
              />
            ) : (
              <FaUserCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" />
            )}
            {imgOption && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full  rounded-full flex flex-col justify-center items-center bg-[#121212]/40 gap-y-3">
                <p>Choose a Picture</p>
                <AiTwotoneEdit />{" "}
                <input
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  type="file"
                />
              </div>
            )}
          </div>
        </form>
        <div className="flex justify-between w-96">
          <button
            onClick={() => navigate("/home")}
            className="px-5 py-3 text-center rounded-lg bg-greyShade3 cursor-pointer"
          >
            SKIP FOR NOW
          </button>
          <button
            onClick={() => {
              submitImage();
            }}
            disabled={imgSrc === null}
            className="px-5 py-3 text-center rounded-lg bg-blueShade1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-28 flex items-center justify-center"
          >
            {loading ? (
              <Oval
                height={20}
                width={20}
                color="#fff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#f5f5f5"
                strokeWidth={10}
                strokeWidthSecondary={10}
              />
            ) : (
              "CONFIRM"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetProfileInfo;
