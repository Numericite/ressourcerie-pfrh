import { z } from "zod";
import { GeneralListQueryParams, Pagination, ZStrapiFile } from "../types";
import { ZRessource } from "../ressources/types";

// -----------------------------
// ----- STRAPI DATA TYPES -----
// -----------------------------

const ZNewsLetterRessourceListItem = z.object({
  position: z.number(),
  ressource: ZRessource,
});

export const ZNewsLetter = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  ressources_list: z.array(ZNewsLetterRessourceListItem),
  external_content: z.string(),
  createdAt: z.optional(z.string()),
  updatedAt: z.optional(z.string()),
  image: z.optional(ZStrapiFile),
});

export type TNewsLetter = z.infer<typeof ZNewsLetter>;

export const ZNewsLetterCreated = ZNewsLetter;
export type TNewsLetterCreated = z.infer<typeof ZNewsLetterCreated>;

export const ZNewsLetterWithoutRessources = ZNewsLetter.omit({
  ressources_list: true,
});

export type TNewsLetterWithoutRessources = z.infer<
  typeof ZNewsLetterWithoutRessources
>;

const createOmits = {
  id: true,
  createdAt: true,
  updatedAt: true,
  image: true,
} as const;

const updateOmits = {
  createdAt: true,
  updatedAt: true,
  image: true,
} as const;

// // -------------------------
// // ----- POST PAYLOADS -----
// // -------------------------
export const ZNewsLetterCreationPayload = ZNewsLetter.omit(createOmits);
export type TNewsLetterCreationPayload = z.infer<
  typeof ZNewsLetterCreationPayload
>;

// // -------------------------
// // ----- PUT PAYLOADS -----
// // -------------------------
export const ZNewsLetterUpdatePayload = ZNewsLetter.omit(updateOmits);
export type TNewsLetterUpdatePayload = z.infer<typeof ZNewsLetterUpdatePayload>;

export const ZNewsLetterUpdateStatusPayload = z.object({
  id: z.number(),
  status: z.string(),
});

export type TNewsLetterUpdateStatusPayload = z.infer<
  typeof ZNewsLetterUpdateStatusPayload
>;

// ---------------------------
// ----- DELETE PAYLOADS -----
// ---------------------------
export const ZNewsLetterDeletionPayload = z.object({
  id: z.number(),
});
export type TNewsLetterDeletionPayload = z.infer<
  typeof ZNewsLetterDeletionPayload
>;

// ------------------------------
// ----- GET SPECIAL PARAMS -----
// ------------------------------
export const ZNewsLetterFindParams = z.object({
  id: z.number(),
  populate: z.object({}).optional(),
});
export type TNewsLetterFindParams = z.infer<typeof ZNewsLetterFindParams>;

// -------------------------
// --- ROUTES DEFINITION ---
// -------------------------
export type NewsLetterGetRoutes =
  | "/api/newsletters/list"
  | "/api/newsletters/find";
export type NewsLetterPostRoutes = "/api/newsletters/create";
export type NewsLetterPutRoutes =
  | "/api/newsletters/update"
  | "/api/newsletters/update-status";
export type NewsLetterDeleteRoutes = "/api/newsletters/delete";

//REQUESTS
export interface NewsLetterRoutesGetParams {
  "/api/newsletters/list": GeneralListQueryParams | undefined;
  "/api/newsletters/find": TNewsLetterFindParams;
}
export interface NewsLetterRoutesPostParams {
  "/api/newsletters/create": TNewsLetterCreationPayload;
}
export interface NewsLetterRoutesPutParams {
  "/api/newsletters/update": TNewsLetterUpdatePayload;
  "/api/newsletters/update-status": TNewsLetterUpdateStatusPayload;
}
export interface NewsLetterRoutesDeleteParams {
  "/api/newsletters/delete": TNewsLetterDeletionPayload;
}

//RESPONSES
export type NewsLetterRoutesDataResponses<T> = T extends "/api/newsletters/list"
  ? { data: TNewsLetter[]; pagination: Pagination }
  : T extends "/api/newsletters/find"
  ? TNewsLetter
  : T extends "/api/newsletters/create"
  ? TNewsLetterWithoutRessources
  : T extends "/api/newsletters/update"
  ? TNewsLetterWithoutRessources
  : T extends "/api/newsletters/update-status"
  ? TNewsLetterWithoutRessources
  : T extends "/api/newsletters/delete"
  ? any
  : never;
