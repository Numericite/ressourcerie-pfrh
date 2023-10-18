import { NextApiRequest, NextApiResponse } from "next";
import { ActiveSlugs, Pagination, StrapiResponseType } from "../types";
import { AxiosInstance } from "axios";
import nextToStrapiHandler from "../../../utils/api/next-to-strapi-handler";
import {
  TNewsLetter,
  TNewsLetterCreationPayload,
  TNewsLetterDeletionPayload,
  TNewsLetterUpdatePayload,
  TNewsLetterUpdateStatusPayload,
  TNewsLetterWithoutRessources,
  ZNewsLetterCreationPayload,
  ZNewsLetterFindParams,
  ZNewsLetterUpdatePayload,
  ZNewsLetterUpdateStatusPayload,
  ZNewsLetterWithoutRessources,
} from "./types";
import { ZNewsLetter, ZNewsLetterDeletionPayload } from "./types";
import { z } from "zod";
import { getRecursiveStrapiObject } from "../../../utils/api/parse-strapi-object";

const activeSlugs: ActiveSlugs = {
  GET: ["list", "count", "find"],
  POST: ["create"],
  PUT: ["update", "update-status"],
  DELETE: ["delete"],
};

const getMethods = async (
  route: string,
  routeParams: {
    [key: string]: string | string[];
  },
  axios: AxiosInstance
): Promise<
  StrapiResponseType<
    | { data: TNewsLetter[]; pagination: Pagination }
    | TNewsLetter
    | number
    | string
  >
> => {
  switch (route) {
    case "list": {
      let { status, data } = await axios.get(`/newsletters`, {
        params: routeParams,
      });
      return {
        status,
        data: {
          data: data.data.map((_: any) =>
            ZNewsLetter.parse(getRecursiveStrapiObject(_))
          ),
          pagination: data.meta.pagination,
        },
      };
    }
    case "find": {
      const { id, ...otherParams } = routeParams;
      ZNewsLetterFindParams.parse({ id: parseInt(id as string) });
      let { status, data } = await axios.get(`/newsletters/${id}`, {
        params: otherParams,
      });

      return {
        status,
        data: ZNewsLetter.parse(getRecursiveStrapiObject(data.data)),
      };
    }
    case "count": {
      const { status, data } = await axios.get(`/newsletters/count`, {
        params: routeParams,
      });
      return { status, data: z.number().parse(data) };
    }
    default:
      return {
        status: 404,
        data: `No GET method found for ${route}`,
      };
  }
};

const postMethods = async (
  route: string,
  routeParams: {
    [key: string]: string | string[];
  },
  body: any,
  axios: AxiosInstance
): Promise<StrapiResponseType<TNewsLetterWithoutRessources | string>> => {
  switch (route) {
    case "create":
      const payload = JSON.parse(body);
      const params: TNewsLetterCreationPayload =
        ZNewsLetterCreationPayload.parse(payload);
      const { status, data } = await axios.post(`/newsletters`, {
        data: params,
      });
      return {
        status,
        data: ZNewsLetterWithoutRessources.parse(
          getRecursiveStrapiObject(data.data)
        ),
      };
    default:
      return {
        status: 404,
        data: `No POST method found for ${route}`,
      };
  }
};

const putMethods = async (
  route: string,
  routeParams: {
    [key: string]: string | string[];
  },
  body: any,
  axios: AxiosInstance
): Promise<StrapiResponseType<TNewsLetterWithoutRessources | string>> => {
  switch (route) {
    case "update":
      const payload = JSON.parse(body);
      const params: TNewsLetterUpdatePayload =
        ZNewsLetterUpdatePayload.parse(payload);
      const { status, data } = await axios.put(`/newsletters/${params.id}`, {
        data: params,
      });
      return {
        status,
        data: ZNewsLetterWithoutRessources.parse(
          getRecursiveStrapiObject(data.data)
        ),
      };
    case "update-status": {
      const payload = JSON.parse(body);
      const params: TNewsLetterUpdateStatusPayload =
        ZNewsLetterUpdateStatusPayload.parse(payload);
      const { status, data } = await axios.put(
        `/newsletters/updateStatus`,
        params
      );
      console.log("status", status, "data", data);
      return {
        status,
        data: ZNewsLetter.parse(getRecursiveStrapiObject(data.data)),
      };
    }
    default:
      return {
        status: 404,
        data: `No PUT method found for ${route}`,
      };
  }
};

const deleteMethods = async (
  route: string,
  routeParams: {
    [key: string]: string | string[];
  },
  body: any,
  axios: AxiosInstance
): Promise<StrapiResponseType<TNewsLetter | string>> => {
  switch (route) {
    case "delete":
      const payload = JSON.parse(body);
      const params: TNewsLetterDeletionPayload =
        ZNewsLetterDeletionPayload.parse(payload);
      const { status, data } = await axios.delete(`/newsletters/${params.id}`);
      return {
        status,
        data: ZNewsLetter.parse(data.data),
      };
    default:
      return {
        status: 404,
        data: `No DELETE method found for ${route}`,
      };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  nextToStrapiHandler(
    req,
    res,
    activeSlugs,
    getMethods,
    postMethods,
    putMethods,
    deleteMethods
  );
  return;
}
