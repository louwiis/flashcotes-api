// src/middlewares/checkLeagueExists.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const Params = z.object({
  league_slug: z.string().min(1),
});

export async function checkLeagueExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // sport must already be set by checkSportExists
  if (!req.sport)
    return reply.code(500).send({ error: "Sport context missing" });

  const parsed = Params.safeParse(req.params);
  if (!parsed.success)
    return reply.code(400).send({ error: "Invalid league params" });

  const { league_slug } = parsed.data;

  const league = await req.server.prisma.league.findFirst({
    where: {
      slug: league_slug,
      sportId: req.sport.id,
    },
  });

  if (!league) {
    return reply.code(404).send({ error: `League '${league_slug}' not found` });
  }

  // Attach it to the request for next handlers
  req.league = league;
}
