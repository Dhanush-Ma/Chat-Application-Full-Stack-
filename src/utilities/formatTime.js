import moment from "moment";

const formatTime = (timestamp) => {
  const time = timestamp.$numberLong ? timestamp.$numberLong : timestamp;
  const date = moment(parseInt(time));
  const hour12 = date.format("h");
  const minute = date.format("mm");
  const amPM = date.format("A");
  const day = date.format("ddd");

  return `${hour12}:${minute} ${amPM} (${day})`;
};

export const getCreatedAtTimme = (timestamp) => {
  const date = moment(parseInt(timestamp));
  const formattedDate = date.format('DD/MM/YYYY h:mma');
  return formattedDate.toUpperCase();
};



export default formatTime;
