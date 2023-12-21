import React from "react";
import { FiSend } from "react-icons/fi";
import { ImAttachment, ImCross } from "react-icons/im";

const ShowImage = ({
  setImageSelected,
  imagePreview,
  handleFile,
  sendMessageToServer,
}) => {
  return (
    <div className="absolute bg-[#121212]/90 w-full h-full rounded-xl top-0 p-5 flex flex-col justify-between">
      <div>
        <ImCross
          size={40}
          onClick={() => setImageSelected(null)}
          className="cursor-pointer ml-auto"
        />
      </div>
      <div className="w-full h-[60%]">
        <img
          className="w-full h-full object-contain"
          src={new URL(URL.createObjectURL(imagePreview))}
          alt=""
        />
      </div>
      <div>
        <div className="flex flex-row-reverse gap-x-10">
          <FiSend
            size={44}
            onClick={() => sendMessageToServer("image")}
            className="cursor-pointer"
          />
          <ImAttachment
            size={44}
            className="cursor-pointer"
            onClick={handleFile}
          />
        </div>
      </div>
    </div>
  );
};

export default ShowImage;
