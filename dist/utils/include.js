// src/utils/includeParser.ts
export const parseIncludeParam = (includeParam, allowed) => {
    const list = includeParam
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? [];
    const includeObject = {};
    for (const key of list) {
        if (allowed.includes(key)) {
            includeObject[key] = true;
        }
    }
    return includeObject;
};
