import { Collapse, Flex, Tag, Text } from "@chakra-ui/react";
import Link from "next/link";

const EventCard = ({ event, currentEvent }: any) => {
  return (
    <Flex w="full" flexDir={"column"}>
      <Tag justifyContent={"center"} variant={"solid"}>
        {event.title}
      </Tag>
    </Flex>
  );
};

export default EventCard;
