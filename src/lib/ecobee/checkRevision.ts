import { select } from "../db/actions";
import { handleIntervalRevisionChange, handleThermostatRevisionChange } from "./handlers";
import { revisionLogger } from "../logger";

const checkRevision = async (accessToken: string ) => {
  revisionLogger("Checking revisions...")

  const revisions = await select(
    "SELECT * FROM Thermostat_Revision_History ORDER BY ID DESC LIMIT 2"
  );

  const latestRevisions = revisions[0];
  const comparedRevisions = revisions[1];

  let revisionChanges = 0

  if (accessToken != undefined) {
    if (latestRevisions.ThermostatRevision > comparedRevisions.ThermostatRevision) {
      await handleThermostatRevisionChange(accessToken);
      revisionChanges++
    }
  
    if (latestRevisions.AlertsRevision > comparedRevisions.AlertsRevision) {
    }
  
    if (latestRevisions.RuntimeRevision > comparedRevisions.RuntimeRevision) {
    }
  
    if (latestRevisions.IntervalRevision > comparedRevisions.IntervalRevision) {
      await handleIntervalRevisionChange(accessToken);
      revisionChanges++
    }
  }

  if (revisionChanges == 0) revisionLogger("No revision changes were found.")
};

export default checkRevision
