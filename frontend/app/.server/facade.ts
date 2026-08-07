import { HealthHelper } from './health-helper';
import { ItemHelper } from './item-helper';
import { HealthCheckResponse, ItemRequest, ItemCalcResponse } from 'lib/types';
import { BadRequestError } from './errors';

let H: HealthHelper;
export function initWithHealthHelper(HEALTH: HealthHelper) {
    H = HEALTH;
}

let I: ItemHelper;
export function initWithItemHelper(ITEM: ItemHelper) {
    I = ITEM;
}

async function checkHealth() {
    
    const result = await H.checkHealth()
    .catch(reason => {
        console.error("Failed to do health-check :: ", reason);
        throw new BadRequestError(400, reason);
    });

    return result.obj as HealthCheckResponse;
}

async function calcItems(itemRequest: ItemRequest) {
    const result = await I.calcItems(itemRequest)
    .catch(reason => {
        console.error("Failed to do item-calc :: ", reason);
        throw new BadRequestError(400, reason);
    });

    const response = result.obj;
    if (Array.isArray(response)) {
        return response as ItemCalcResponse[];
    }
    return [response] as ItemCalcResponse[];
}

export { checkHealth, calcItems };
