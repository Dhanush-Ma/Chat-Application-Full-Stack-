const getUser = (setUser) => {
  let xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      setUser(JSON.parse(xmlhttp.response));
    }
  };

  xmlhttp.open(
    "GET",
    "http://localhost:8089/Chat_Application/user?userID=" +
      localStorage.getItem("token"),
    true
  );
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send();
};

export default getUser;
