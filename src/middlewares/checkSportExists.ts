// src/middlewares/checkSportExists.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const Params = z.object({ sport_slug: z.string().min(1) });

export async function checkSportExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = Params.safeParse(req.params);
  if (!parsed.success)
    return reply.code(400).send({ error: "Invalid sport params" });

  const { sport_slug } = parsed.data;
  const sport = await req.server.prisma.sport.findUnique({
    where: { slug: sport_slug },
  });

  if (!sport) {
    return reply.code(404).send({ error: `Sport '${sport_slug}' not found` });
  }

  // Attach it to the request for next handlers
  req.sport = sport;
}
