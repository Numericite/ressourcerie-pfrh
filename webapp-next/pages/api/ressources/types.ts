import { z } from "zod";
import { GeneralListQueryParams, Pagination } from "../types";
import { ressourceVideoSourceEnum } from "../../../utils/globals/enums";

// -----------------------------
// ----- STRAPI DATA TYPES -----
// -----------------------------

const ZRessourceLink = z.object({
  link: z.string(),
  kind: z.literal("link"),
});

const ZRessourceVideo = z.object({
  link: z.string(),
  source: z.enum(ressourceVideoSourceEnum),
  kind: z.literal("video"),
});

const ZRessourceBase = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string(),
});

export const ZRessource = z.discriminatedUnion("kind", [
  ZRessourceBase.extend(ZRessourceLink.shape),
  ZRessourceBase.extend(ZRessourceVideo.shape),
]);
export type TRessource = z.infer<typeof ZRessource>;

export const ZRessourceCreated = ZRessource;
export type TRessourceCreated = z.infer<typeof ZRessourceCreated>;

// // -------------------------
// // ----- POST PAYLOADS -----
// // -------------------------
// export const ZRessourceCreationPayload = ZRessource.omit({
//   id: true,
// });
// export type TRessourceCreationPayload = z.infer<
//   typeof ZRessourceCreationPayload
// >;

// // -------------------------
// // ----- PUT PAYLOADS -----
// // -------------------------
// export const ZRessourceUpdatePayload = ZRessource;
// export type TRessourceUpdatePayload = z.infer<typeof ZRessourceUpdatePayload>;

// ---------------------------
// ----- DELETE PAYLOADS -----
// ---------------------------
export const ZRessourceDeletionPayload = z.object({
  id: z.number(),
});
export type TRessourceDeletionPayload = z.infer<
  typeof ZRessourceDeletionPayload
>;

// ------------------------------
// ----- GET SPECIAL PARAMS -----
// ------------------------------
export const ZRessourceFindParams = z.object({
  id: z.number(),
});
export type TRessourceFindParams = z.infer<typeof ZRessourceFindParams>;

// -------------------------
// --- ROUTES DEFINITION ---
// -------------------------
export type RessourceGetRoutes =
  | "/api/ressources/list"
  | "/api/ressources/find";
export type RessourcePostRoutes = "/api/ressources/create";
export type RessourcePutRoutes = "/api/ressources/update";
export type RessourceDeleteRoutes = "/api/ressources/delete";

//REQUESTS
export interface RessourceRoutesGetParams {
  "/api/ressources/list": GeneralListQueryParams | undefined;
  "/api/ressources/find": TRessourceFindParams;
}
// export interface RessourceRoutesPostParams {
//   "/api/ressources/create": TRessourceCreationPayload;
// }
// export interface RessourceRoutesPutParams {
//   "/api/ressources/update": TRessourceUpdatePayload;
// }
export interface RessourceRoutesDeleteParams {
  "/api/ressources/delete": TRessourceDeletionPayload;
}

//RESPONSES
export type RessourceRoutesDataResponses<T> = T extends "/api/ressources/list"
  ? { data: TRessource[]; pagination: Pagination }
  : T extends "/api/ressources/find"
  ? TRessource
  : // : T extends "/api/ressources/create"
  // ? TRessource
  // : T extends "/api/ressources/update"
  // ? TRessource
  T extends "/api/ressources/delete"
  ? TRessource
  : never;
