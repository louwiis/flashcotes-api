import { checkLeagueExists } from "@/middlewares/checkLeagueExists";
import { checkSportExists } from "@/middlewares/checkSportExists";
import { LeagueSchema } from "@/schemas";
const leaguesRoutes = async (fastify) => {
    const f = fastify.withTypeProvider();
    // Apply middleware to check if sport exists for all routes in this plugin
    f.addHook("preHandler", checkSportExists);
    // GET /api/sports/:sport_slug/leagues
    f.get("/", {
        schema: {
            response: { 200: LeagueSchema.LeagueListDto },
        },
        async handler(req, reply) {
            const leagues = await fastify.prisma.league.findMany({
                orderBy: { createdAt: "desc" },
            });
            return reply.send({
                data: leagues,
                total: leagues.length,
            });
        },
    });
    // GET /api/sports/:sport_slug/leagues/:league_slug
    f.get("/:league_slug", {
        preHandler: checkLeagueExists,
        schema: {
            response: { 200: LeagueSchema.LeagueDto },
        },
    }, async (req, reply) => {
        return req.league;
    });
    // POST /api/sports/:sport_slug/leagues
    f.post("/", {
        schema: {
            body: LeagueSchema.CreateLeagueBody,
            response: { 201: LeagueSchema.LeagueDto },
        },
    }, async (req, reply) => {
        const created = await f.prisma.league.create({
            data: {
                name: req.body.name,
                slug: req.body.slug,
                sport: {
                    connect: { slug: req.body.sport_slug },
                },
                country: {
                    connect: { slug: req.body.country_slug },
                },
            },
        });
        return reply.code(201).send(created);
    });
    // DELETE /api/sports/:sport_slug/leagues/:league_slug
    f.delete("/:league_slug", { preHandler: checkLeagueExists }, async (req, reply) => {
        await f.prisma.league.delete({ where: { id: req.league.id } });
        return reply.code(204).send();
    });
};
export default leaguesRoutes;
