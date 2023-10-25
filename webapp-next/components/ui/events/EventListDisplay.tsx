import React from "react";
import {
  Container,
  Flex,
  keyframes,
  SimpleGrid,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import { TEvents } from "../../../pages/api/events/types";
import EventListCard from "./EventListCard";
import _ from "lodash";

interface EventListDisplayProps {
  events: TEvents[];
}

const EventListDisplay = (props: EventListDisplayProps) => {
  const { events } = props;
  const cardSize = 230;
  const [windowSize, setWindowSize] = React.useState<number>(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState<boolean>(true);

  React.useEffect(() => {
    setWindowSize(window.innerWidth);
  }, []);

  const scroll = keyframes`
  0% {
    transform: translateX(${cardSize}px);
  }
  100% {
    transform: translateX(-${cardSize * 2}px);
  }
  `;

  const animation = prefersReducedMotion
    ? undefined
    : `${scroll} 15s linear infinite alternate`;

  React.useMemo(() => {
    if (!shouldAutoScroll) {
      setTimeout(() => {
        setShouldAutoScroll(true);
      }, 5000);
    }
  }, [shouldAutoScroll]);

  let orderedEvents = _.orderBy(events, ["start_date"], ["asc"]);

  return (
    <Flex bg={"#F2FBF9"}>
      <Container
        maxW="container.2lg"
        py={3.5}
        display={"flex"}
        overflowX={"scroll"}
      >
        <SimpleGrid
          onScrollCapture={(e) => {
            e.preventDefault();
            setShouldAutoScroll(false);
          }}
          columns={events.length}
          spacing={10}
          overflowX={"hidden"}
          scrollBehavior="smooth"
          animation={shouldAutoScroll ? animation : undefined}
          minW={
            cardSize * events.length > windowSize
              ? cardSize * events.length
              : windowSize
          }
        >
          {orderedEvents.map((event) => {
            return (
              <EventListCard key={event.id} event={event} cardSize={cardSize} />
            );
          })}
        </SimpleGrid>
      </Container>
    </Flex>
  );
};

export default EventListDisplay;
