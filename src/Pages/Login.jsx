import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context/Context";
import styles from "../Stylesheet/Login.module.css";
import { AiOutlineUser, AiFillWarning } from "react-icons/ai";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { setUser } = useContext(Context);
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username && !formData.password && !formData.username) return;
    let xmlhttp = new XMLHttpRequest();

    const data = `username=${formData.username}&password=${formData.password}`;
    console.log(data);

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        setErrMsg("");
        setUser(JSON.parse(xmlhttp.response));
        localStorage.setItem("token", JSON.parse(xmlhttp.response)._id.$oid);
        navigate("/home");
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
        setErrMsg(xmlhttp.responseText);
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 401) {
        setErrMsg(xmlhttp.responseText);
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 409) {
        setErrMsg(xmlhttp.responseText);
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 500) {
      }
    };

    xmlhttp.open("POST", "http://localhost:8089/Chat_Application/login", true);
    xmlhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xmlhttp.send(data);

    // setFormData({
    //   username: "",
    //   password: "",
    // });
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1 className="font-bold text-4xl mb-5">Welcome Back.</h1>
        <p>
          Don't have an account?{" "}
          <Link className="text-blueShade1 " to={"/register"}>
            Sign In
          </Link>
        </p>
        <form
          className="flex flex-col gap-y-5 mt-8 text-greyShade2 w-80"
          onSubmit={(e) => handleSubmit(e)}
        >
          {errMsg && (
            <div className="text-white-600 bg-red-600 px-2 py-3 rounded-lg justify-center text-base flex items-center gap-x-2">
              <AiFillWarning size={24} />
              <p>{errMsg}</p>
            </div>
          )}
          <div className="flex items-center justify-between gap-x-2 px-5 py-3 rounded-lg bg-greyShade1 hover:border-blueShade1 hover:border-4">
            <input
              value={formData.username}
              className="bg-transparent outline-none w-full"
              type="username"
              name="username"
              placeholder="Username"
              onChange={(e) => handleChange(e)}
            />
            <AiOutlineUser color="#fff" size="20px" />
          </div>
          <div className="flex items-center gap-x-2 px-5 py-3 rounded-lg bg-greyShade1 justify-between hover:border-blueShade1 hover:border-4">
            <input
              value={formData.password}
              className="bg-transparent outline-none w-full "
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
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
            value={"LOGIN"}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
