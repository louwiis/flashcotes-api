export async function checkBookmakerExists(req, reply) {
    const { bookmaker_slug } = req.params;
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
