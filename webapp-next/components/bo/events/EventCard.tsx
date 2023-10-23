import { Box } from "@chakra-ui/react";
import { TEvents } from "../../../pages/api/events/types";

interface EventCardProps {
  event: {
    title: string;
    start: Date;
    end: Date;
  };
}

const EventCard = ({ event }: any) => {
  return <Box>{event.title}</Box>;
};

export default EventCard;
