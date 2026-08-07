import {
  AuthError,
  BadRequestError,
  ForbiddenError,
  ServerError,
} from "./errors";
import { HealthCheckResponse, ToolResponse, ApiError } from "lib/types";

export type HealthHelper = {
    checkHealth: () => Promise<ToolResponse<HealthCheckResponse>>;
}

export function init(server: string): HealthHelper {

    const checkResponse = (response: Response) => {
        const httpStatus = response.status;
        const statusTxt: string = response.statusText ? `status=[${response.status}]: ${response.statusText}` : `status=[${response.status}]`;
        const contentType = response.headers.get('Content-Type') || '';

        if (httpStatus <= 199 || httpStatus >= 300 && httpStatus <= 399) {
            throw new Error(httpStatus.toString());
        }

        else if (contentType.toLowerCase().startsWith('application/json')) {
            return Promise.all([httpStatus, statusTxt, "", response.json()]);
        }

        else return Promise.all([httpStatus, statusTxt, response.text(), {}]);
    };

    const convert = (path: string, result: [number, string, string, any]) => {
        const [httpStatus, statusTxt, text, json] = result;
        console.info(`${new Date().toISOString()} -- Response from Health-Check Service :: Q[${path}] S[${httpStatus}]`);

        if (httpStatus == 401) {
            throw new AuthError(httpStatus, json);
        } else if (httpStatus == 403) {
            throw new ForbiddenError(httpStatus, json);
        } else if (httpStatus >= 400 && httpStatus <= 499) {
            throw new BadRequestError(httpStatus, json);
        } else if (httpStatus >= 500 && httpStatus <= 599) {
            throw new ServerError(httpStatus, json);
        }

        return {
            status: statusTxt, text: text, obj: json as HealthCheckResponse | ApiError
        } as ToolResponse<HealthCheckResponse>;
    };

    const checkHealth = async () => {
        const path = '/api/v1/health-check';
        console.info(`[HealthHelper] Fetching health check from: ${server}${path}`);
        return fetch(`${server}${path}`, {
            method: 'GET',
        }).then(response => checkResponse(response)).then(
            result => convert(path, result)
        );
    };

    console.info(`healthHelper initialized.`)
    return { checkHealth };
}