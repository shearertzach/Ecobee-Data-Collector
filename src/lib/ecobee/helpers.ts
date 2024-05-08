import moment from "moment";

// HELPERS
export const getRuntimeReport = async (token: string) => {
  const startDate = moment().subtract(1, "day").format("YYYY-MM-DD");
  // const startDate = '2024-04-24'
  const endDate = moment().add(1, "days").format("YYYY-MM-DD");

  const url = `https://api.ecobee.com/1/runtimeReport?format=json&body={"startDate":"${startDate}","endDate":"${endDate}","columns":"outdoorTemp,outdoorHumidity","selection":{"selectionType":"thermostats","selectionMatch":"531627136589"}}`;

//   if (token == "") return res.send("No auth code was provided.");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  const runtimes = json.reportList[0].rowList.map((r: string) => {
    const [date, time, temp, humidity] = r.split(",");

    return {
      TimeStamp: moment(`${date} ${time}`).format("YYYY-MM-DD HH:mm:ss.sss"),
      temp,
      humidity,
    };
  });

  return runtimes;
};
