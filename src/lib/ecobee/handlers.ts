import { insert } from "../db/actions";
import moment from "moment";
import { getRuntimeReport } from "./helpers";
import { handlerLogger } from "../logger";
import { EcobeeFormattedRuntime } from "../types/ecobee";

// Handle Thermostat Revision Change
export const handleThermostatRevisionChange = async (accessToken: string) => {
  handlerLogger("Detected thermostat change");

  // Declare Var values
  const url =
    'https://api.ecobee.com/1/thermostat?json={"selection":{"selectionType":"registered","includeSettings":"true"}}';

  //   if (accessToken == "") return res.send("No auth code was provided.");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  const settings = json.thermostatList[0].settings;

  const settingsCols = Object.keys(settings).join(", ");
  const settingsValues = Object.values(settings)
    .map((value) => `"${value}"`)
    .join(", ");

  const statement1 = `INSERT INTO Thermostat_Settings_History (${settingsCols}) VALUES (${settingsValues})`;

  await insert(statement1);

  return;
};

// Handle Interval Revision Change
export const handleIntervalRevisionChange = async (accessToken: string) => {
  handlerLogger("Detected interval change");

  // Declare Var values
  const url =
    'https://api.ecobee.com/1/thermostat?json={"selection":{"selectionType":"registered","includeExtendedRuntime":"true"}}';

  //   if (accessToken == "") return res.send("No auth code was provided.");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  const runtimes = await getRuntimeReport(accessToken);

  handlerLogger(runtimes.length)

  const lastReading = moment(
    json.thermostatList[0].extendedRuntime.lastReadingTimestamp
  ).subtract(5, "hours");

  const runtimeInfo = json.thermostatList[0].extendedRuntime;

  for (let i = 2; i >= 0; i--) {
    handlerLogger('Interval: ' + String(i))
    const timeInterval = [15, 10, 5];

    const formattedInfo: EcobeeFormattedRuntime = {
      TimeStamp: moment(lastReading)
        .subtract(15, "minutes")
        .add(timeInterval[i], "minutes")
        .format("YYYY-MM-DD HH:mm:ss.sss"),
      ActualTemperature: runtimeInfo.actualTemperature[i] * 0.1,
      ActualHumidity: runtimeInfo.actualHumidity[i],
      DesiredHeat: runtimeInfo.desiredHeat[i] * 0.1,
      DesiredCool: runtimeInfo.desiredCool[i] * 0.1,
      DesiredHumidity: runtimeInfo.desiredHumidity[i],
      DesiredDehumidity: runtimeInfo.desiredDehumidity[i],
      HeatRuntime: runtimeInfo.auxHeat1[i],
      CoolRuntime: runtimeInfo.cool1[i],
      FanRuntime: runtimeInfo.fan[i],
    };

    const infoCols = Object.keys(formattedInfo).join(", ");
    const infoValues = Object.values(formattedInfo)
      .map((value) => `"${value}"`)
      .join(", ");

    const outdoorStats = runtimes.find(
      (r: EcobeeFormattedRuntime) => r.TimeStamp == formattedInfo.TimeStamp
    );
    handlerLogger("Inserting...")
    const statement = `INSERT INTO Thermostat_Data_History (${infoCols}, OutdoorTemp, OutdoorHumidity) VALUES (${infoValues}, ${outdoorStats.temp}, ${outdoorStats.humidity})`;
    handlerLogger("Insert complete")
    await insert(statement);
  }
  return;
};
