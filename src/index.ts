import dotenv from "dotenv";
import { CronJob } from "cron";
import { consoleLogger } from "./lib/logger";
import { select } from "./lib/db/actions";
import { pollThermostat } from "./routes/thermostat";
import { refreshToken } from "./lib/middleware/auth";

dotenv.config();

// Pin and AccessToken Generation (UNCOMMENT WHEN NEED NEW PIN)
// ----------------------------------------------------------------------
// setup()
// ----------------------------------------------------------------------

const job = new CronJob("*/5 * * * *", async () => {
  consoleLogger("Cron Job Trigger");

  const lastToken = await select(
    "SELECT AccessToken FROM Thermostat_Tokens ORDER BY ID DESC LIMIT 1;"
  );
  const refreshedToken = await refreshToken(lastToken[0].AccessToken);

  await pollThermostat(refreshedToken);
});

job.start();
