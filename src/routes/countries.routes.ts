import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { CountrySchema } from "@/schemas";
import { checkCountryExists } from "@/middlewares/checkCountryExists";

const countriesRoutes: FastifyPluginAsync = async (fastify) => {
  const f = fastify.withTypeProvider<ZodTypeProvider>();

  // GET /api/users
  f.get(
    "/",
    {
      schema: {
        response: {
          200: CountrySchema.CountryListDto,
        },
      },
    },
    async (req, reply) => {
      const countries = await f.prisma.country.findMany({
        orderBy: { createdAt: "desc" },
      });

      console.log(countries);

      return reply.send({ data: countries, total: countries.length });
    }
  );

  // GET /api/countries/:country_slug
  f.get(
    "/:country_slug",
    { preHandler: checkCountryExists },
    async (req, reply) => {
      return reply.send(req.country);
    }
  );

  // POST /api/countries
  f.post(
    "/",
    {
      schema: {
        body: CountrySchema.CreateCountryBody,
        response: {
          201: CountrySchema.CountryDto,
        },
      },
    },
    async (req, reply) => {
      const created = await f.prisma.country.create({
        data: req.body,
      });

      return reply.code(201).send(created);
    }
  );

  // DELETE /api/countries/:country_slug
  f.delete(
    "/:country_slug",
    { preHandler: checkCountryExists },
    async (req, reply) => {
      await f.prisma.country.delete({ where: { id: req.country!.id } });
      return reply.code(204).send();
    }
  );
};

export default countriesRoutes;
