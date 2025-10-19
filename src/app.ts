// app.ts
import "dotenv/config";
import Fastify from "fastify";

import cors from "@fastify/cors";
import type { Prisma } from "@prisma/client";
import apiRoutes from "./routes";
import { z, ZodError } from "zod";

import prismaPlugin from "./plugins/prisma";
import zodPlugin from "./plugins/zod";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

function isPrismaKnownError(
  e: unknown
): e is Prisma.PrismaClientKnownRequestError {
  return (
    typeof e === "object" && e !== null && "code" in e && "clientVersion" in e
  );
}

const app = Fastify().withTypeProvider<ZodTypeProvider>();

await app.register(cors, {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Total-Count"],
  credentials: true,
});
await app.register(zodPlugin);
await app.register(prismaPlugin);
await app.register(apiRoutes, { prefix: "/api" });

// === Error handler global ===
app.setErrorHandler((err, _req, reply) => {
  // 1) Validation (Zod)
  if (err instanceof ZodError) {
    return reply.status(400).send({
      message: "Invalid request",
      code: "BAD_REQUEST",
      details: err.flatten(),
    });
  }

  // 2) Prisma (duplicat, not found constraint, etc.)
  if (isPrismaKnownError(err)) {
    // Doc: https://www.prisma.io/docs/reference/api-reference/error-reference
    switch (err.code) {
      case "P2002":
        return reply.status(409).send({
          message: "Un enregistrement avec ces informations existe déjà.",
          code: "UNIQUE_CONSTRAINT",
          field: (err.meta as any)?.target?.[0], // souvent ['slug'] ou ['email']
        });

      case "P2025":
        return reply.status(404).send({
          message: "L'élément demandé est introuvable.",
          code: "NOT_FOUND",
        });

      case "P2003":
        return reply.status(409).send({
          message:
            "Impossible de supprimer cet élément car il est utilisé ailleurs (contrainte de clé étrangère).",
          code: "FOREIGN_KEY_CONSTRAINT",
        });

      case "P2014":
        return reply.status(400).send({
          message:
            "La relation entre les éléments est invalide. Vérifie les dépendances avant de continuer.",
          code: "INVALID_RELATION",
        });

      default:
        return reply.status(500).send({
          message: "Erreur de base de données inconnue.",
          code: err.code,
        });
    }
  }

  // 3) Erreurs custom avec statusCode
  if ((err as any)?.statusCode) {
    return reply.status((err as any).statusCode).send({
      message: err.message ?? "Error",
      code: (err as any).code ?? "APP_ERROR",
    });
  }

  // 4) Fallback
  app.log.error(err);
  return reply.status(500).send({
    message: "Internal app Error",
    code: "INTERNAL_app_ERROR",
  });
});

// 404 handler
app.setNotFoundHandler((_req, reply) => {
  reply
    .status(404)
    .send({ message: "Route not found", code: "ROUTE_NOT_FOUND" });
});

/// Lancement
const PORT = process.env.PORT || 3000;
app.listen({ port: Number(PORT), host: "0.0.0.0" }).then(() => {
  console.log(`Server running on port ${PORT}`);
});
