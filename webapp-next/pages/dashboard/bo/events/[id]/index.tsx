import { Box, Container } from "@chakra-ui/react";
import BackButton from "../../../../../components/ui/back-button/back-button";

const EventCreate = () => {
  return (
    <Box minW="full">
      <Box mb={4}>
        <BackButton />
      </Box>
      <Container maxW="container.lg">
        <Box>Créer un nouvel évenement</Box>
      </Container>
    </Box>
  );
};

export default EventCreate;
