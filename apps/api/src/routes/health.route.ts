// apps/api/src/routes/health.route.ts

import { FastifyInstance } from 'fastify';

/**
 * Health Route
 * Provides basic API health check
 */
async function healthRoute(app: FastifyInstance) {
    app.get('/health', async () => {
        return {
            status: 'ok',
            service: 'kagaya-api',
            timestamp: new Date().toISOString(),
        };
    });
}

export default healthRoute;