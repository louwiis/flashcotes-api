// src/middlewares/checkBookmakerExists.ts
import type { FastifyRequest, FastifyReply } from "fastify";

export async function checkBookmakerExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { bookmaker_slug } = req.params as { bookmaker_slug: string };
  const bookmaker = await req.server.prisma.bookmaker.findUnique({
    where: { slug: bookmaker_slug },
  });

  if (!bookmaker) {
    return reply
      .code(404)
      .send({ error: `Bookmaker '${bookmaker_slug}' not found` });
  }

  // Attach it to the request for next handlers
  req.bookmaker = bookmaker;
}
