import { Box, Heading, Text } from "@chakra-ui/react";
import UITable from "../../../../components/ui/table";
import { useRouter } from "next/router";
import {
  ColumnDef,
  DataResponse,
} from "../../../../components/ui/table/interfaces";
import { TRessource } from "../../../api/ressources/types";
import { fetchApi } from "../../../../utils/api/fetch-api";
import { TNewsLetter } from "../../../api/newsletters/types";

const NewsLetter = () => {
  const router = useRouter();

  const columnDefs: ColumnDef<TNewsLetter> = [
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
  const changeActions = [];

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
