// src/server.ts
import { buildApp } from "./app";
import { env } from "./config/env";
import { execa } from "execa";
async function maybeRunMigrations() {
    if (!env.RUN_MIGRATIONS)
        return;
    try {
        console.log(">> Running prisma migrate deploy...");
        await execa("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit" });
        console.log(">> Migrations complete");
    }
    catch (e) {
        console.error("Prisma migrate failed", e);
        process.exit(1);
    }
}
async function main() {
    await maybeRunMigrations();
    const app = await buildApp();
    const addr = await app.listen({ host: env.HOST, port: Number(env.PORT) });
    app.log.info(`🚀 listening on ${addr} (env=${env.NODE_ENV})`);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
