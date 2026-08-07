import { index, route, RouteConfig } from '@react-router/dev/routes';

export const CONFIG_GTAOL: RouteConfig = [

    index('routes/common/kortz.tsx'),

    route('/health-check', 'routes/common/health-check.tsx'),

]