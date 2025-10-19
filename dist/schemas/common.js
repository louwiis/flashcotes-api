// src/schemas/common.ts
import { z } from "zod";
export const IncludeQuerySchema = z.object({
    include: z.string().optional(),
});
