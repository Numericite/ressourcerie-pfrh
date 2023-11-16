import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import { TRessource } from "../../../pages/api/ressources/types";
import RessourceCard from "../ressources/ressource-card";

interface Props {
  ressources: TRessource[];
}

const RessourceNewsletterDisplay = (props: Props) => {
  const { ressources } = props;
  return (
    <Box w="full" bg="#F2FBF9" py={12}>
      <Container maxW="container.2lg" my="2.125rem">
        <Heading as="h2" fontSize="2xl" mb="1.5rem">
          Les informations utiles
        </Heading>
        <SimpleGrid columns={[1, ressources.length]} spacing={10}>
          {ressources.map((ressource) => (
            <RessourceCard
              key={ressource.id}
              ressource={ressource}
              clickable={true}
              target={"_blank"}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default RessourceNewsletterDisplay;
