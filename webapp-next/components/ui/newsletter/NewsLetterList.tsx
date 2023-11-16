import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { TNewsLetter } from "../../../pages/api/newsletters/types";
import { formatDateToFrenchString } from "../../../utils/tools";
import IconPlaceHolder from "../icon-placeholder";

interface Props {
  newsletters: TNewsLetter[];
  handleNewsLetterChange: (newsLetter: TNewsLetter) => void;
}

const NewsLetterList = (props: Props) => {
  const { newsletters } = props;

  if (!newsletters) return <></>;

  return (
    <Box bg="#FAFFFD">
      <Container maxW="container.2lg" py="0.125rem">
        <Heading as="h3" fontSize={["xl", "2xl"]} mb="1.5rem">
          Newsletters précédentes
        </Heading>
        <HStack display={"flex"}>
          {newsletters.map((newsletter) => {
            return (
              <Card
                onClick={() => {
                  props.handleNewsLetterChange(newsletter);
                }}
                cursor="pointer"
                key={newsletter.id}
                variant="article"
                w="fit-content"
                h="full"
                borderRadius={"xl"}
                p={1}
                _hover={{
                  bgGradient:
                    "linear(to-tr, rgba(47, 108, 255, 0.05),rgba(151, 248, 177, 0.05))",
                }}
              >
                <CardHeader>
                  {newsletter.title} {" - "}
                  {formatDateToFrenchString(newsletter.createdAt as string)}
                </CardHeader>
                <CardBody>
                  <HStack display="flex" gap={2}>
                    {newsletter.ressources_list.map((el) => {
                      return (
                        <IconPlaceHolder
                          key={el.position}
                          kind={el.ressource.kind}
                        />
                      );
                    })}
                  </HStack>
                </CardBody>
              </Card>
            );
          })}
        </HStack>
      </Container>
    </Box>
  );
};

export default NewsLetterList;
