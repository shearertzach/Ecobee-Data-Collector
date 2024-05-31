import dotenv from "dotenv";
import cron from "node-cron";
import { consoleLogger } from "./lib/logger";
import { select } from "./lib/db/actions";
import { pollThermostat } from "./routes/thermostat";
import { refreshToken } from "./lib/middleware/auth";
import moment from "moment";

dotenv.config();

// Pin and AccessToken Generation (UNCOMMENT WHEN NEED NEW PIN)
// ----------------------------------------------------------------------
// setup()
// ----------------------------------------------------------------------



cron.schedule("*/5 * * * *", async () => {
  consoleLogger(
    "Cron Job Trigger at " + String(moment(moment.now()).toLocaleString())
  );

  consoleLogger("Gathering Latest Token...");
  const lastToken = await select(
    "SELECT AccessToken FROM Thermostat_Tokens ORDER BY ID DESC LIMIT 1;"
  );
  consoleLogger("Latest Token: " + lastToken[0].AccessToken)
  const refreshedToken = await refreshToken(lastToken[0].AccessToken);

  await pollThermostat(refreshedToken);

  consoleLogger('done.')
})

