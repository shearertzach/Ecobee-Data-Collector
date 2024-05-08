import { insert } from "../lib/db/actions";
import checkRevision from "../lib/ecobee/checkRevision";
import { revisionLogger, thermostatLogger } from "../lib/logger";

export const pollThermostat = async (accessToken: string) => {
  const url =
    'https://api.ecobee.com/1/thermostatSummary?json={"selection":{"selectionType":"thermostats","selectionMatch":"531627136589","includeEquipmentStatus":true,"includeExtendedRuntime":true,"includeVersion":true}}';

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  if (!json.revisionList)
    return revisionLogger(
      "Authorization Code Expired. Refreshing token then trying again..."
    );

  const revisions = await json.revisionList[0]
    .split(":")
    .map((value: string) => `"${value}"`)
    .join(",");

  await insert(
    `INSERT INTO Thermostat_Revision_History (Device, DeviceName, Connected, ThermostatRevision, AlertsRevision, RuntimeRevision, IntervalRevision) VALUES (${revisions})`
  );

  await checkRevision(accessToken);
};
