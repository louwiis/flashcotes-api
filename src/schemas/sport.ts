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

export const makeListDto = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    total: z.number().int().nonnegative(),
  });
export const SportListDto = makeListDto(SportDto);
export const SportWithRelationsListDto = makeListDto(SportWithRelationsDto);

// ── Inferred TS types (exporting these is super handy)
export type CreateSportBody = z.infer<typeof CreateSportBody>;
export type SportParams = z.infer<typeof SportParams>;
export type SportDto = z.infer<typeof SportDto>;
export type SportWithRelationsDto = z.infer<typeof SportWithRelationsDto>;
export type SportListDto = z.infer<typeof SportListDto>;
export type SportWithRelationsListDto = z.infer<
  typeof SportWithRelationsListDto
>;
