import { Collapse, Flex, Tag, Text } from "@chakra-ui/react";
import Link from "next/link";

const EventCard = ({ event, currentEvent }: any) => {
  return (
    <Flex w="full" flexDir={"column"}>
      <Tag justifyContent={"center"} variant={"solid"}>
        {event.title}
      </Tag>
      {event.extendedProps && (
        <Collapse
          in={event.title === currentEvent?.title}
          animateOpacity
          transition={{ exit: { delay: 2 }, enter: { duration: 10 } }}
        >
          <Flex
            justifyContent={"center"}
            py={2}
            color="white"
            bg="teal.300"
            rounded="md"
            shadow="md"
          >
            <Link href={event.extendedProps.external_link} target="_blank">
              <Text fontSize="xs">{event.extendedProps.external_link}</Text>
            </Link>
          </Flex>
        </Collapse>
      )}
    </Flex>
  );
};

export default EventCard;
