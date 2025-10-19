// src/schemas/sport.ts
import { z } from "zod";
import { CountryDto } from "./country";
import { SportDto } from "./sport";
// ── Inputs
export const CreateLeagueBody = z.object({
    name: z.string().min(2).max(100),
    slug: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    sport_slug: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    country_slug: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
});
// ── Responses
export const LeagueDto = z.object({
    name: z.string().min(2).max(100),
    slug: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
});
export const LeagueWithRelationsDto = LeagueDto.extend({
    sport: z.lazy(() => SportDto).optional(),
    country: z.lazy(() => CountryDto).optional(),
});
export const makeListDto = (item) => z.object({
    data: z.array(item),
    total: z.number().int().nonnegative(),
});
export const LeagueListDto = makeListDto(LeagueDto);
export const LeagueWithRelationsListDto = makeListDto(LeagueWithRelationsDto);
