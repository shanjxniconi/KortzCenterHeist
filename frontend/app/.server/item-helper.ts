import {
  AuthError,
  BadRequestError,
  ForbiddenError,
  ServerError,
} from "./errors";
import { ItemRequest, ItemCalcResponse, ToolResponse, ApiError } from "lib/types";

export type ItemHelper = {
    calcItems: (itemRequest: ItemRequest) => Promise<ToolResponse<ItemCalcResponse[]>>;
}

export function init(server: string): ItemHelper {

    const checkResponse = (response: Response) => {
        const httpStatus = response.status;
        const statusTxt: string = response.statusText ? `status=[${response.status}]: ${response.statusText}` : `status=[${response.status}]`;
        const contentType = response.headers.get('Content-Type') || '';

        if (httpStatus < 200 || httpStatus >= 300) {
            throw new Error(httpStatus.toString());
        }

        else if (contentType.toLowerCase().startsWith('application/json')) {
            return Promise.all([httpStatus, statusTxt, "", response.json()]);
        }

        else return Promise.all([httpStatus, statusTxt, response.text(), {}]);
    };

    const convert = (path: string, result: [number, string, string, any]) => {
        const [httpStatus, statusTxt, text, json] = result;
        console.info(`${new Date().toISOString()} -- Response from Item Service :: Q[${path}] S[${httpStatus}]`);

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
            status: statusTxt, text: text, obj: json as ItemCalcResponse[] | ApiError
        } as ToolResponse<ItemCalcResponse[]>;
    };

    const calcItems = async (requestBody: ItemRequest) => {
        const path = '/api/v1/calcItems';
        const json = JSON.stringify(requestBody);
        console.info(`[ItemHelper] Fetching Items from: ${server}${path}`);
        return fetch(`${server}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: json,
        }).then(response => checkResponse(response)).then(
            result => convert(path, result)
        );
    };

    console.info(`ItemHelper initialized.`)
    return { calcItems };
}