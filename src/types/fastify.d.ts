import "@fastify/type-provider-typebox"; // if you're using TypeBox (optional)
import { Sport } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    sport?: Sport;
    country?: Country;
    league?: League;
    bookmaker?: Bookmaker;
  }
}
