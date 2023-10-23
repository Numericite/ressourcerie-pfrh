import { Box, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface EventsManagerProps {
  events: any[];
}

const EventsManager = (props: EventsManagerProps) => {
  const router = useRouter();

  return (
    <Box minW="full">
      <Heading size="lg" mb={5}>
        Gestion des évenements à venir :{" "}
      </Heading>
      <Button
        size="lg"
        mb={5}
        onClick={() => router.push("/dashboard/bo/events/new")}
      >
        Ajouter un évenement
      </Button>
    </Box>
  );
};

export default EventsManager;
