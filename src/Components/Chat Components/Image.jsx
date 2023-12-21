import React, { useEffect, useState } from "react";

const Image = ({ data }) => {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    setImgSrc(data);



  }, [data]);

  return (
    <img src={imgSrc} className="w-full h-full object-contain rounded-md" />
  );
};

export default Image;
