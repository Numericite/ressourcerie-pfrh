import { z } from "zod";
import { GeneralListQueryParams, Pagination } from "../types";

// -----------------------------
// ----- STRAPI DATA TYPES -----
// -----------------------------
export const ZEvents = z.object({
  id: z.number().optional(),
  title: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  external_link: z.string(),
});
export type TEvents = z.infer<typeof ZEvents>;

export const ZEventsCreated = ZEvents;
export type TEventsCreated = z.infer<typeof ZEventsCreated>;

// -------------------------
// ----- POST PAYLOADS -----
// -------------------------
export const ZEventsCreationPayload = ZEvents;
export type TEventsCreationPayload = z.infer<typeof ZEventsCreationPayload>;

// -------------------------
// ----- PUT PAYLOADS -----
// -------------------------
export const ZEventsUpdatePayload = ZEvents;
export type TEventsUpdatePayload = z.infer<typeof ZEventsUpdatePayload>;

// ---------------------------
// ----- DELETE PAYLOADS -----
// ---------------------------
export const ZEventsDeletionPayload = z.object({
  id: z.number(),
});
export type TEventsDeletionPayload = z.infer<typeof ZEventsDeletionPayload>;

// ------------------------------
// ----- GET SPECIAL PARAMS -----
// ------------------------------
export const ZEventsFindParams = z.object({
  id: z.number(),
});
export type TEventsFindParams = z.infer<typeof ZEventsFindParams>;

// -------------------------
// --- ROUTES DEFINITION ---
// -------------------------
export type EventsGetRoutes = "/api/events/list" | "/api/events/find";
export type EventsPostRoutes = "/api/events/create";
export type EventsPutRoutes = "/api/events/update";
export type EventsDeleteRoutes = "/api/events/delete";

//REQUESTS
export interface EventsRoutesGetParams {
  "/api/events/list": GeneralListQueryParams | undefined;
  "/api/events/find": TEventsFindParams;
}
export interface EventsRoutesPostParams {
  "/api/events/create": TEventsCreationPayload;
}
export interface EventsRoutesPutParams {
  "/api/events/update": TEventsUpdatePayload;
}
export interface EventsRoutesDeleteParams {
  "/api/events/delete": TEventsDeletionPayload;
}

//RESPONSES
export type EventsRoutesDataResponses<T> = T extends "/api/events/list"
  ? { data: TEvents[]; pagination: Pagination }
  : T extends "/api/events/find"
  ? TEvents
  : T extends "/api/events/create"
  ? TEvents
  : T extends "/api/events/update"
  ? TEvents
  : T extends "/api/events/delete"
  ? TEvents
  : never;
