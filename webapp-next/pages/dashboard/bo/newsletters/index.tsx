import { Box, Heading, Text } from "@chakra-ui/react";
import UITable from "../../../../components/ui/table";
import { useRouter } from "next/router";
import {
  ChangeAction,
  ColumnDef,
  DataResponse,
} from "../../../../components/ui/table/interfaces";
import { TRessource } from "../../../api/ressources/types";
import { fetchApi } from "../../../../utils/api/fetch-api";
import { TNewsLetter } from "../../../api/newsletters/types";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";
import useModals from "../../../../utils/hooks/useModals";

const NewsLetter = () => {
  const router = useRouter();
  const { confirm } = useModals();

  const columnDefs: ColumnDef<TNewsLetter>[] = [
    {
      key: "createdAt",
      label: "Date de création",
      renderItem: (item: TNewsLetter) => {
        return (
          <Text fontSize="sm">
            {new Date(item.createdAt as string).toLocaleDateString()}
          </Text>
        );
      },
    },
    {
      key: "title",
      label: "Nom",
    },
    {
      key: "description",
      label: "Contenu",
    },
  ];
  const changeActions: ChangeAction<TNewsLetter>[] = [
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
        return confirm("Supprimer la ressource" + item.title + " ?").then(
          (value) => {
            if (value) {
              return fetchApi.delete("/api/newsletters/delete", {
                id: item.id,
              });
            }
          }
        );
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
      })
      .then((response) => {
        console.log(response);
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
