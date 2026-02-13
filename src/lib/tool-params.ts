import {
  createSearchParamsCache,
  createSerializer,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  tool: parseAsString.withDefault("draw"),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
