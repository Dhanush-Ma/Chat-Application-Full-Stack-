import { useState, useContext, useEffect } from "react";
import styles from "../Stylesheet/Login.module.css";
import { AiOutlineUser, AiFillWarning } from "react-icons/ai";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const { setUser, user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) navigate("/profile");
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.username &&
      !formData.password &&
      !formData.firstName &&
      !formData.lastName
    )
      return;
    let xmlhttp = new XMLHttpRequest();

    const data = `firstName=${formData.firstName}&lastName=${formData.lastName}&username=${formData.username}&password=${formData.password}`;

    console.log(data);
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        setErrMsg("");
        setUser(JSON.parse(xmlhttp.response));
        localStorage.setItem("token", JSON.parse(xmlhttp.response)._id.$oid);
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
        setErrMsg(xmlhttp.responseText);
        navigate("/profile");
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 409) {
        setErrMsg(xmlhttp.responseText);
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 500) {
      }
    };

    xmlhttp.open(
      "POST",
      "http://localhost:8089/Chat_Application/register",
      true
    );
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlhttp.send(data);

    // setFormData({
    //   firstName: "",
    //   lastName: "",
    //   username: "",
    //   password: "",
    // });
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className="font-bold text-4xl mb-5">Create an account.</h1>
        <p>
          Already have an account?{" "}
          <Link className="text-blueShade1 " to={"/"}>
            Log In
          </Link>
        </p>
        <form
          className="flex flex-col gap-y-5 mt-8 text-greyShade2 w-96"
          onSubmit={(e) => handleSubmit(e)}
        >
          {errMsg && (
            <div className="text-white-600 bg-red-600 px-2 py-3 rounded-lg justify-center text-base flex items-center gap-x-2">
              <AiFillWarning size={24} />
              <p>{errMsg}</p>
            </div>
          )}
          <div className="w-full  flex gap-x-5">
            <div className="flex items-center justify-between gap-x-2 px-5 py-3 rounded-lg bg-greyShade1 hover:border-blueShade1 hover:border-4">
              <input
                className="bg-transparent outline-none w-full"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleChange(e)}
              />
              {/* <AiOutlineUser color="#fff" size="20px" /> */}
            </div>
            <div className="flex items-center justify-between gap-x-2 px-5 py-3 rounded-lg bg-greyShade1 hover:border-blueShade1 hover:border-4">
              <input
                className="bg-transparent outline-none w-full"
                type="etext"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange(e)}
              />
              {/* <AiOutlineUser color="#fff" size="20px" /> */}
            </div>
          </div>

          <div className="flex items-center justify-between gap-x-2 px-5 py-3 rounded-lg bg-greyShade1 hover:border-blueShade1 hover:border-4">
            <input
              className="bg-transparent outline-none w-full"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleChange(e)}
            />
            <AiOutlineUser color="#fff" size="20px" />
          </div>
          <div className="flex items-center gap-x-2 px-5 py-3 rounded-lg bg-greyShade1 justify-between hover:border-blueShade1 hover:border-4">
            <input
              className="bg-transparent outline-none w-full "
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
            {!showPassword ? (
              <BsEyeSlash
                className="cursor-pointer"
                color="#fff"
                size="20px"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <BsEye
                className="cursor-pointer"
                color="#fff"
                size="20px"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>

          <input
            className="px-5 py-3 text-center rounded-lg bg-blueShade1 cursor-pointer hover:opacity-70"
            type="submit"
            value={"SIGN UP"}
          />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
