function getChatBackup(roomID, setMessages) {
  let xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      setMessages(JSON.parse(this.responseText).messages);
    }else{
        setMessages([])
    }
  };

  xmlhttp.open(
    "GET",
    `http://localhost:8089/Chat_Application/messages?roomID=${roomID}`,
    true
  );
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send();
}

export default getChatBackup;
