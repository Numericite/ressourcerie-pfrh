import { Collapse, Flex, Tag, Text } from "@chakra-ui/react";
import Link from "next/link";

const EventCard = ({ event, currentEvent }: any) => {
  return (
    <Flex w="full" flexDir={"column"}>
      <Tag justifyContent={"center"} variant={"solid"} p={2}>
        <Text noOfLines={2}>{event.title}</Text>
      </Tag>
    </Flex>
  );
};

export default EventCard;
