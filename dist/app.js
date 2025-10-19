// src/app.ts
import Fastify from "fastify";
import { env, isProd } from "./config/env";
import { validatorCompiler, serializerCompiler, } from "fastify-type-provider-zod";
export async function buildApp() {
    const app = Fastify({
        logger: { level: env.LOG_LEVEL },
        trustProxy: env.TRUST_PROXY,
        bodyLimit: 1_000_000,
    }).withTypeProvider();
    // Zod compilers
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    // Security middlewares (prod-lean)
    if (env.ENABLE_HELMET) {
        const helmet = (await import("@fastify/helmet")).default;
        await app.register(helmet, { contentSecurityPolicy: false });
    }
    // Same-origin by default (since /api is proxied through same domain)
    if (env.ENABLE_CORS) {
        const cors = (await import("@fastify/cors")).default;
        await app.register(cors, { origin: true, credentials: true });
    }
    // Basic rate-limit in prod
    if (isProd) {
        const rateLimit = (await import("@fastify/rate-limit")).default;
        await app.register(rateLimit, {
            max: env.RATE_LIMIT_MAX,
            timeWindow: env.RATE_LIMIT_WINDOW,
        });
    }
    // Health endpoint
    app.get("/health", async () => ({ ok: true, env: env.NODE_ENV }));
    // Register your API routes with prefix from env
    const { default: apiRoutes } = await import("./routes");
    await app.register(apiRoutes, { prefix: env.API_PREFIX });
    // Global error handler (no stack leaks)
    app.setErrorHandler((err, req, reply) => {
        if (err?.validation || err.name === "ZodError") {
            return reply
                .code(400)
                .send({ message: "Invalid request", code: "BAD_REQUEST" });
        }
        req.log.error({ err }, "Request failed");
        return reply
            .code(500)
            .send({ message: "Internal Server Error", code: "INTERNAL_ERROR" });
    });
    // 404
    app.setNotFoundHandler((_req, reply) => {
        reply
            .code(404)
            .send({ message: "Route not found", code: "ROUTE_NOT_FOUND" });
    });
    // Graceful shutdown
    const close = () => app.close().catch(() => process.exit(1));
    process.on("SIGTERM", close);
    process.on("SIGINT", close);
    return app;
}
