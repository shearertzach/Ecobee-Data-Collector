import moment from "moment";
import { insert, select } from "../db/actions";
import { authLogger } from "../logger";

// For locally hosted applications, automatically refresh token

export const refreshToken = async (accessToken: string) => {
  // Query Database for time it was generated
  const tokens = await select(
    `SELECT * FROM Thermostat_Tokens WHERE AccessToken = "${accessToken}" ORDER BY ID DESC LIMIT 1;`
  );

  // If resultset empty, error out
  if (tokens.length == 0) return;

  // Compare time and check if needs refresh
  const lastTokenTime = moment(tokens[0].Timestamp).subtract(5, "hours").unix();
  const currentTime = moment().unix();
  const timeDifference = Math.floor(currentTime - lastTokenTime);
  const tokenExpired = timeDifference > 3600;

  // If needs refresh, refresh through api and return new access token to user
  if (tokenExpired) {
    authLogger("Token Expired");
    // Declare Var values
    const grantType = "refresh_token";
    const refresh_token = tokens[0].RefreshToken;
    const clientId = process.env.API_KEY;
    // Fetch new access and refresh token from API
    const response = await fetch(
      `https://api.ecobee.com/token?grant_type=${grantType}&code=${refresh_token}&client_id=${clientId}`
    );
    const json = await response.json();

    if (response.status == 200) authLogger("Refreshed token.");

    // Insert new tokens into DB
    insert(
      `INSERT INTO Thermostat_Tokens (AccessToken, RefreshToken, Pin) VALUES ("${json.access_token}", "${json.refresh_token}", "${tokens[0].Pin}")`
    );
    return json.access_token;
  }

  return accessToken;
};
