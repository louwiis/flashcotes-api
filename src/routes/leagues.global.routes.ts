import type { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { LeagueSchema, IncludeQuerySchema } from "@/schemas";
import { parseIncludeParam } from "@/utils/include";

const leaguesGlobalRoutes: FastifyPluginAsync = async (fastify) => {
  const f = fastify.withTypeProvider<ZodTypeProvider>();

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
      ] as const);

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
