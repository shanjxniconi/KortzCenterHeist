import { type RouteConfig } from '@react-router/dev/routes';
import dotenv from 'dotenv';

import { CONFIG_GTAOL } from './routes/config';

const context = dotenv.config({ path: './.env' });

const env: string = (context.parsed ? context.parsed['NODE_ENV'] : null) || 'development';
const app: string = (context.parsed ? context.parsed['NODE_APP'] : null) || 'gtaol';

let config = CONFIG_GTAOL;

switch (env) {
    case 'development':
        config = CONFIG_GTAOL;
}

console.info(`=== loading routes config :: env=${env}, app=${app} ===`);
export default config satisfies RouteConfig