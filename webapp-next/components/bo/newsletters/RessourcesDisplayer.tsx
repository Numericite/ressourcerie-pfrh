import { Box, Card, Flex, Stack, Tag, Text } from "@chakra-ui/react";
import { TRessource } from "../../../pages/api/ressources/types";
import IconPlaceHolder from "../../ui/icon-placeholder";

const RessourcesDisplayer = ({
  ressources,
}: {
  ressources: Array<TRessource>;
}) => {
  return (
    <Stack spacing={4} flexDir={"column"} w="full">
      {ressources.map((ressource, index) => (
        <Card
          key={index}
          p={3}
          border={"1px solid #2F80ED"}
          borderRadius={"xl"}
          boxShadow="0px 54px 67px -50px #F4F9FF"
        >
          <Text>{ressource.name}</Text>
          <Flex justify={"space-between"} py={3}>
            <IconPlaceHolder kind={ressource.kind} />
            <Tag colorScheme={ressource.theme.color}>
              {ressource.theme.name}
            </Tag>
          </Flex>
        </Card>
      ))}
    </Stack>
  );
};

export default RessourcesDisplayer;
