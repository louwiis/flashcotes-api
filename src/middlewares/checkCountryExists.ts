// src/middlewares/checkCountryExists.ts
import type { FastifyRequest, FastifyReply } from "fastify";

export async function checkCountryExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { country_slug } = req.params as { country_slug: string };
  const country = await req.server.prisma.country.findUnique({
    where: { slug: country_slug },
  });

  if (!country) {
    return reply
      .code(404)
      .send({ error: `Country '${country_slug}' not found` });
  }

  // Attach it to the request for next handlers
  req.country = country;
}
