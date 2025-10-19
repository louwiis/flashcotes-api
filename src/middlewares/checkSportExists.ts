// src/middlewares/checkSportExists.ts
import type { FastifyRequest, FastifyReply } from "fastify";

export async function checkSportExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { sport_slug } = req.params as { sport_slug: string };
  const sport = await req.server.prisma.sport.findUnique({
    where: { slug: sport_slug },
  });

  if (!sport) {
    return reply.code(404).send({ error: `Sport '${sport_slug}' not found` });
  }

  // Attach it to the request for next handlers
  req.sport = sport;
}
