// src/schemas/sport.ts
import { z } from "zod";
// ── Inputs
export const CreateCountryBody = z.object({
    name: z.string().min(2).max(100),
    slug: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    icon: z.string().max(4),
});
// ── Responses
export const CountryDto = z.object({
    name: z.string().min(2).max(100),
    slug: z
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9-]+$/),
    icon: z.string().max(4),
});
export const CountryListDto = z.object({
    data: z.array(CountryDto),
    total: z.number().int().nonnegative(),
});
