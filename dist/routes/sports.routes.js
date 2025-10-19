import { checkSportExists } from "@/middlewares/checkSportExists";
import { SportSchema, IncludeQuerySchema } from "@/schemas";
import { parseIncludeParam } from "@/utils/include";
const sportsRoutes = async (fastify) => {
    const f = fastify.withTypeProvider();
    f.get("/", {
        schema: {
            querystring: IncludeQuerySchema,
            response: { 200: SportSchema.SportWithRelationsListDto },
        },
        async handler(req, reply) {
            const include = parseIncludeParam(req.query.include, [
                "leagues",
            ]);
            const sports = await fastify.prisma.sport.findMany({
                orderBy: { createdAt: "desc" },
                include,
            });
            return reply.send({
                data: sports,
                total: sports.length,
            });
        },
    });
    // GET /api/sports/:sport_slug
    f.get("/:sport_slug", {
        preHandler: checkSportExists,
        schema: {
            response: { 200: SportSchema.SportDto },
        },
    }, async (req, reply) => {
        return req.sport;
    });
    // POST /api/sports
    f.post("/", {
        schema: {
            body: SportSchema.CreateSportBody,
            response: { 201: SportSchema.SportDto },
        },
    }, async (req, reply) => {
        const created = await f.prisma.sport.create({
            data: {
                name: req.body.name,
                slug: req.body.slug,
                icon: req.body.icon,
            },
        });
        return reply.code(201).send(created);
    });
    // DELETE /api/sports/:sport_slug
    f.delete("/:sport_slug", { preHandler: checkSportExists }, async (req, reply) => {
        await f.prisma.sport.delete({ where: { id: req.sport.id } });
        return reply.code(204).send();
    });
};
export default sportsRoutes;
