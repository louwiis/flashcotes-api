import { LeagueSchema, IncludeQuerySchema } from "@/schemas";
import { parseIncludeParam } from "@/utils/include";
const leaguesGlobalRoutes = async (fastify) => {
    const f = fastify.withTypeProvider();
    // GET /api/leagues
    f.get("/", {
        schema: {
            querystring: IncludeQuerySchema,
            response: { 200: LeagueSchema.LeagueWithRelationsListDto },
        },
        async handler(req, reply) {
            const include = parseIncludeParam(req.query.include, [
                "sport",
                "country",
            ]);
            console.log("Include:", include);
            const leagues = await fastify.prisma.league.findMany({
                orderBy: { createdAt: "desc" },
                include,
            });
            return reply.send({
                data: leagues,
                total: leagues.length,
            });
        },
    });
    // // GET /api/leagues/:league_slug
    // f.get("/:league_slug", async (req, reply) => {
    //   return req.league;
    // });
};
export default leaguesGlobalRoutes;
