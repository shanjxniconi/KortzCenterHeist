import { Outlet, Scripts } from 'react-router';

export default function Root() {
    return (
        <html lang="zh-CN">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>GTAOL Helper</title>
            </head>
            <body>
                <Outlet />
                <Scripts />
            </body>
        </html>
    );
}