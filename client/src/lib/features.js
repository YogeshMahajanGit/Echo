import moment from "moment";

export const fileFormat = (url = "") => {
  const fileExtention = url.split(".").pop();

  if (
    fileExtention === "mp4" ||
    fileExtention === "webm" ||
    fileExtention === "ogg"
  )
    return "video";

  if (
    fileExtention === "png" ||
    fileExtention === "jpg" ||
    fileExtention === "jpeg" ||
    fileExtention === "gif"
  )
    return "image";

  return "file";
};

export const transformImage = (url = "", width = 100) => url;

export const getLastWeek = () => {
  const currentDate = moment();

  const lastWeek = [];

  for (let i = 0; i < currentDate.length; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    lastWeek.unshift(dayName);
  }
  return lastWeek;
};
