// src/middlewares/checkCountryExists.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const Params = z.object({ country_slug: z.string().min(1) });

export async function checkCountryExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const parsed = Params.safeParse(req.params);
  if (!parsed.success)
    return reply.code(400).send({ error: "Invalid country params" });

  const { country_slug } = parsed.data;
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
