// swagger.js
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import pkg from '../package.json' assert { type: 'json' };
import config from '../utils/configs.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ParkingPark API',
            version: pkg.version,
            description: 'ParkingPark API Information',
            contact: {
                name: 'Developer',
                email: 'matanew1@bardugo.com',
            },
            license: {
                name: 'MIT License',
                url: 'https://spdx.org/licenses/MIT.html',
            },
        },
        servers: [
            {
                url: config.env === 'production'
                    ? 'https://api.yourapp.com'
                    : `http://localhost:${config.port}`,
                description: config.env === 'production' ? 'Production server' : 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-KEY',
                },
            },
        },
        security: [{
            ApiKeyAuth: [],
        }],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

const setupSwagger = (app) => {
    const swaggerOptions = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
};

export default setupSwagger;