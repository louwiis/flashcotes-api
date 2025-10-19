// src/schemas/sport.ts
import { z } from "zod";
import { LeagueDto } from "./league";
// ── Inputs
export const CreateSportBody = z.object({
    name: z.string().min(2).max(100),
    slug: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    icon: z.string().max(4),
});
export const SportParams = z.object({
    id: z.string().uuid(),
});
// ── Responses
export const SportDto = z.object({
    name: z.string().min(2).max(100),
    slug: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    icon: z.string().max(4),
});
export const SportWithRelationsDto = SportDto.extend({
    leagues: z.array(z.lazy(() => LeagueDto)).optional(),
});
export const makeListDto = (item) => z.object({
    data: z.array(item),
    total: z.number().int().nonnegative(),
});
export const SportListDto = makeListDto(SportDto);
export const SportWithRelationsListDto = makeListDto(SportWithRelationsDto);
