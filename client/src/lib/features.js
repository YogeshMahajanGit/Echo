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

export const transformImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload", `upload/dpr_auto/w_${width}/`);

  return newUrl;
};

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

export const actionsFromLocalStorage = ({ key, value, get }) => {
  if (get) {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  } else {
    return localStorage.setItem(key, JSON.stringify(value));
  }
};
