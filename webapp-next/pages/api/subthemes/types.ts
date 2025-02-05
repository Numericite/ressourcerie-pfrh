import { z } from "zod";
import { GeneralListQueryParams, Pagination } from "../types";

// -----------------------------
// ----- STRAPI DATA TYPES -----
// -----------------------------

export const ZSubTheme = z.object({
  id: z.number(),
  name: z.string()
});

export type TSubTheme = z.infer<typeof ZSubTheme>;

export const ZSubThemeCreated = ZSubTheme;
export type TSubThemeCreated = z.infer<typeof ZSubThemeCreated>;

// ---------------------------
// ----- DELETE PAYLOADS -----
// ---------------------------
export const ZSubThemeDeletionPayload = z.object({
  id: z.number(),
});
export type TSubThemeDeletionPayload = z.infer<typeof ZSubThemeDeletionPayload>;

// ------------------------------
// ----- GET SPECIAL PARAMS -----
// ------------------------------
export const ZSubThemeFindParams = z.object({
  id: z.number(),
});
export type TSubThemeFindParams = z.infer<typeof ZSubThemeFindParams>;

// -------------------------
// --- ROUTES DEFINITION ---
// -------------------------
export type SubThemeGetRoutes = "/api/subthemes/list" | "/api/subthemes/find";
export type SubThemeDeleteRoutes = "/api/subthemes/delete";

//REQUESTS
export interface SubThemeRoutesGetParams {
  "/api/subthemes/list": GeneralListQueryParams | undefined;
  "/api/subthemes/find": TSubThemeFindParams;
}
export interface SubThemeRoutesDeleteParams {
  "/api/subthemes/delete": TSubThemeDeletionPayload;
}

//RESPONSES
export type SubThemeRoutesDataResponses<T> = T extends "/api/subthemes/list"
  ? { data: TSubTheme[]; pagination: Pagination }
  : T extends "/api/subthemes/find"
  ? TSubTheme
  : T extends "/api/subthemes/delete"
  ? TSubTheme
  : never;
