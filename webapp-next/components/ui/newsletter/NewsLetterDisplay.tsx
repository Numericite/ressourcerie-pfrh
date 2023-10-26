import { Box, Container, Flex, Heading, HStack } from "@chakra-ui/react";
import Image from "next/image";
import { TNewsLetter } from "../../../pages/api/newsletters/types";
import { TRessource } from "../../../pages/api/ressources/types";
import { displayMonthYear } from "../../../utils/tools";
import RessourceSimilar from "../ressources/ressource-similar";
import MoreActualities from "./MoreActualities";
import RessourceNewsletterDisplay from "./RessourceNewsLetterDisplay";

interface NewsLetterDisplayProps {
  newsletter: TNewsLetter;
}

const NewsLetterDisplay = (props: NewsLetterDisplayProps) => {
  const { newsletter } = props;

  const ressources = newsletter.ressources_list.map((ressource, index) => {
    if (index + 1 === ressource.position) {
      return ressource.ressource;
    }
  });

  return (
    <Box minW="full">
      <Flex>
        <Container maxW="container.2lg" my="2.125rem">
          <HStack display={"flex"} justify="center" align={"center"}>
            <Image
              src={"/newsletter.png"}
              width={70}
              height={70}
              alt="newsletter_pfrh_icon"
            />
            <Heading
              as="h2"
              fontSize={["xl", "2xl"]}
              mb="1.5rem"
              textAlign={"center"}
            >
              {newsletter.title} -{" "}
              {displayMonthYear(newsletter.createdAt as string)}
            </Heading>
          </HStack>
        </Container>
      </Flex>
      <RessourceNewsletterDisplay ressources={ressources as TRessource[]} />
      <MoreActualities moreInfos={newsletter.external_content} />
    </Box>
  );
};

export default NewsLetterDisplay;
