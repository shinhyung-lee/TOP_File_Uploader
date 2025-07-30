const formattedDateTime = (dateTimeString) => {

  const dateTimeConvertedToESTString = dateTimeString.toLocaleString("en-US", {
    timeZone: "America/New_York",
    hourCycle: "h23",
  });
  let zeroAddedDateTime = dateTimeConvertedToESTString;
  if (typeof dateTimeConvertedToESTString[0] !== "0") {
    // add 0 to the string if it doesn't start with 0
    zeroAddedDateTime = "0".concat(zeroAddedDateTime);
  }
  // remove comma from the datetime string ex) 07/30/2025, 17:40:17
  const formattedTime = zeroAddedDateTime.replace(",", "");
  // type: string
  return formattedTime;
};

module.exports = {
  formattedDateTime,
};
