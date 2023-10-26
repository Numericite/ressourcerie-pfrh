import { Badge, Box, Heading, Tag, Text, useToast } from "@chakra-ui/react";
import UITable from "../../../../components/ui/table";
import { useRouter } from "next/router";
import {
  ChangeAction,
  ColumnDef,
  DataResponse,
} from "../../../../components/ui/table/interfaces";

import { fetchApi } from "../../../../utils/api/fetch-api";
import {
  TNewsLetter,
  TNewsLetterUpdateStatusPayload,
} from "../../../api/newsletters/types";
import { BsPencil, BsTrash, BsJournal } from "react-icons/bs";
import useModals from "../../../../utils/hooks/useModals";

const NewsLetter = () => {
  const router = useRouter();
  const { confirm } = useModals();

  const columnDefs: ColumnDef<TNewsLetter>[] = [
    {
      key: "title",
      label: "Nom",
    },
    {
      key: "createdAt",
      label: "Date de création",
      renderItem: (item: TNewsLetter) => {
        return (
          <Text fontSize="sm">
            {new Date(item.createdAt as string).toLocaleDateString("fr-FR")}
          </Text>
        );
      },
    },
    {
      key: "status",
      label: "Statut",
      renderItem: (item: TNewsLetter) => {
        return (
          <Badge
            fontSize="sm"
            colorScheme={item.status === "draft" ? "orange" : "green"}
          >
            {item.status === "draft" ? "Brouillon" : "Publié"}
          </Badge>
        );
      },
    },
  ];
  const changeActions: ChangeAction<TNewsLetter>[] = [
    {
      key: "publish",
      label: "Publier",
      hide: (item: TNewsLetter) => item.status === "sent",
      icon: <BsJournal />,
      action: (item: TNewsLetter) => {
        return confirm("Publier la newsletter" + item.title + " ?").then(
          (value) => {
            if (value) {
              const payload: TNewsLetterUpdateStatusPayload = {
                id: item.id,
                status: "sent",
              };
              return fetchApi.put("/api/newsletters/update-status", payload);
            }
          }
        );
      },
    },
    {
      key: "unpublish",
      label: "Dépublier",
      hide: (item: TNewsLetter) => item.status === "draft",
      icon: <BsJournal />,
      action: (item: TNewsLetter) => {
        return confirm("Dépublier la newsletter" + item.title + " ?").then(
          (value) => {
            if (value) {
              const payload: TNewsLetterUpdateStatusPayload = {
                id: item.id,
                status: "draft",
              };
              return fetchApi.put("/api/newsletters/update-status", payload);
            }
          }
        );
      },
    },
    {
      key: "update",
      label: "Modifier",
      icon: <BsPencil />,
      action: (item: TNewsLetter) => {
        router.push("/dashboard/bo/newsletters/" + item.id);
      },
    },
    {
      key: "delete",
      label: "",
      icon: <BsTrash />,
      action: (item: TNewsLetter) => {
        return confirm(
          "Supprimer la newsLetter " + " " + item.title + " ?"
        ).then((value) => {
          if (value) {
            return fetchApi.delete("/api/newsletters/delete", {
              id: item.id,
            });
          }
        });
      },
    },
  ];

  const retrieveData = (
    page: number,
    pageSize: number
  ): Promise<DataResponse<TNewsLetter>> => {
    return fetchApi
      .get("/api/newsletters/list", {
        pagination: {
          page,
          pageSize,
        },
        sort: {
          createdAt: "desc",
        },
        populate: {
          ressources_list: { populate: ["ressource"] },
        },
      })
      .then((response) => {
        return {
          count: response.pagination.total,
          items: response.data,
        };
      });
  };

  return (
    <Box minW="full">
      <Heading size="lg" mb={5}>
        Gestion des newsletters :{" "}
      </Heading>
      <UITable
        retrieveData={retrieveData}
        columnDefs={columnDefs}
        changeActions={changeActions}
        onNewItem={() => {
          router.push("/dashboard/bo/newsletters/new");
        }}
      />
    </Box>
  );
};

export default NewsLetter;
