import bookmakersRoutes from "./bookmakers.routes";
import countriesRoutes from "./countries.routes";
import leaguesGlobalRoutes from "./leagues.global.routes";
import leaguesRoutes from "./leagues.routes";
import sportsRoutes from "./sports.routes";
const apiRoutes = async (fastify) => {
    fastify.get("/health", async () => ({ ok: true }));
    await fastify.register(bookmakersRoutes, { prefix: "/bookmakers" });
    await fastify.register(countriesRoutes, { prefix: "/countries" });
    await fastify.register(leaguesGlobalRoutes, { prefix: "/leagues" });
    await fastify.register(leaguesRoutes, {
        prefix: "/sports/:sport_slug/leagues",
    });
    await fastify.register(sportsRoutes, { prefix: "/sports" });
};
export default apiRoutes;
