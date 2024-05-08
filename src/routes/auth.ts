import { insert, select } from "../lib/db/actions";
import {
  EcobeeAccessTokenGenerationResponse,
  EcobeeError,
  EcobeePinGenerationResponse,
} from "../lib/types/ecobee";

export const generatePin = async (): Promise<
  EcobeePinGenerationResponse | EcobeeError
> => {
  // Declare Var values
  const resType = "ecobeePin";
  const clientId = process.env.API_KEY;
  const scope = "smartWrite";

  const response = await fetch(
    `https://api.ecobee.com/authorize?response_type=${resType}&client_id=${clientId}&scope=${scope}`
  );

  if (response.status != 200) return <EcobeeError>{ Error: "Bad request" };

  const json: EcobeePinGenerationResponse = await response.json();

  await insert(
    `INSERT INTO Thermostat_Tokens (AccessToken, Pin) VALUES ("${json.code}", "${json.ecobeePin}")`
  );

  return json;
};

// Get access token for api calls
export const generateAccessToken = async (
  authCode: string
): Promise<EcobeeAccessTokenGenerationResponse | EcobeeError> => {
  // Declare Var values
  const grantType = "ecobeePin";
  const clientId = process.env.API_KEY;

  // Check for auth code in URL
  if (authCode == undefined)
    return <EcobeeError>{
      Error: "No auth code was provided.",
      Status: "Error",
    };

  // Fetch new access and refresh token
  const response = await fetch(
    `https://api.ecobee.com/token?grant_type=${grantType}&code=${authCode}&client_id=${clientId}`
  );

  // If user hasnt entered Pin
  if (response.status == 401)
    return <EcobeeError>{
      Error: "Waiting for user to authorize application in Ecobee dashboard.",
      Status: "Error",
    };

  if (response.status != 200)
    return <EcobeeError>{ Error: "Bad Request", Status: "Error" };

  // If good response, create refresh token then store info into DB
  const json: EcobeeAccessTokenGenerationResponse = await response.json();

  // Find pin for auth code
  const pinQuery = await select(
    `SELECT Pin FROM Thermostat_Tokens WHERE AccessToken = "${authCode}" ORDER BY ID ASC LIMIT 1`
  );

  // If no pin, tell user
  if (pinQuery.length == 0)
    return <EcobeeError>{
      Error: "No pin found with this access code.",
      Status: "Error",
    };

  await insert(
    `INSERT INTO Thermostat_Tokens (AccessToken, RefreshToken, Pin) VALUES ("${json.access_token}", "${json.refresh_token}", "${pinQuery[0].Pin}")`
  );

  return json;
};
