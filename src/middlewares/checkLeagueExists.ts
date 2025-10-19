// src/middlewares/checkLeagueExists.ts
import type { FastifyRequest, FastifyReply } from "fastify";

export async function checkLeagueExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { league_slug } = req.params as { league_slug: string };
  const league = await req.server.prisma.league.findUnique({
    where: { slug: league_slug },
  });

  if (!league) {
    return reply.code(404).send({ error: `League '${league_slug}' not found` });
  }

  // Attach it to the request for next handlers
  req.league = league;
}
