// src/utils/includeParser.ts
export const parseIncludeParam = <T extends string>(
  includeParam: string | undefined,
  allowed: readonly T[]
): Record<T, boolean> => {
  const list =
    includeParam
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const includeObject = {} as Record<T, boolean>;

  for (const key of list) {
    if (allowed.includes(key as T)) {
      includeObject[key as T] = true;
    }
  }

  return includeObject;
};
