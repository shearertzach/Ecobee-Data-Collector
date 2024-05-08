import { Request } from "express";

export interface ThermostatRequest extends Request {
    accessToken?: string
}