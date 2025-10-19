import { checkBookmakerExists } from "@/middlewares/checkBookmakerExists";
const bookmakersRoutes = async (fastify) => {
    // GET /api/bookmakers
    fastify.get("/", async () => {
        return fastify.prisma.bookmaker.findMany({
            orderBy: { createdAt: "desc" },
        });
    });
    // GET /api/bookmakers/:bookmaker_slug
    fastify.get("/:bookmaker_slug", { preHandler: checkBookmakerExists }, async (req, reply) => {
        return req.bookmaker;
    });
    // POST /api/bookmakers
    fastify.post("/", async (req, reply) => {
        const body = req.body;
        const created = await fastify.prisma.bookmaker.create({ data: body });
        return reply.code(201).send(created);
    });
};
export default bookmakersRoutes;
