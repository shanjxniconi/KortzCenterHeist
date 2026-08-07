import * as H from './health-helper';
import * as I from './item-helper';
import type { HealthHelper } from './health-helper'
import type { ItemHelper } from './item-helper'
import * as F from './facade';
import dotenv from 'dotenv';
import * as process from 'node:process';

let HEALTH: HealthHelper;
let ITEM: ItemHelper;

let started = false;
let initializedAt: Date | undefined = undefined;

export async function init() {
    if (!started) {
        dotenv.config();
        const env: string = process.env['NODE_ENV'] || 'dev';
        const server: string = process.env['API_BASE_URL'] || process.env['SERVER'] || 'http://localhost:8080';

        started = true;
        console.info(`:: CONFIGURATION INFO ::`);
        console.info(`env :: ${env}`);
        console.info(`server :: ${server}`);

        HEALTH = H.init(server);
        F.initWithHealthHelper(HEALTH);
        console.info(`completed load HEALTH .... ${new Date().toISOString()}`);

        ITEM = I.init(server);
        F.initWithItemHelper(ITEM);
        console.info(`completed load ITEM .... ${new Date().toISOString()}`);

        initializedAt = new Date();
    }
    return initializedAt;
}

init().then(initializedAt => console.info(`Initialized Application Context At ${initializedAt} [${started}]`));

export { HEALTH };
