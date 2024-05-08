import moment from "moment";

export interface EcobeeFormattedRuntime {
  TimeStamp: string;
  ActualTemperature: number;
  ActualHumidity: number;
  DesiredHeat: number;
  DesiredCool: number;
  DesiredHumidity: number;
  DesiredDehumidity: number;
  HeatRuntime: number;
  CoolRuntime: number;
  FanRuntime: number;
}

export interface EcobeePinGenerationResponse {
  ecobeePin: string;
  code: string;
  scope?: string;
  expires_in?: number;
  interval?: number;
  Status: "Success"
}

export interface EcobeeError {
  Error: string;
  Status: "Error"
}

export interface EcobeeAccessTokenGenerationResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token: string;
  scope?: string;
  Status: "Success";
  Message?: string;
}
