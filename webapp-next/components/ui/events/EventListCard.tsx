import { Box, Flex, HStack, Text, Link } from "@chakra-ui/react";
import { BiExport } from "react-icons/bi";
import { FiCalendar } from "react-icons/fi";
import { TEvents } from "../../../pages/api/events/types";
import { formatDateToFrenchString } from "../../../utils/tools";

interface EventListCardProps {
  event: TEvents;
  cardSize: number;
}

const EventListCard = (props: EventListCardProps) => {
  const { event, cardSize } = props;
  return (
    <Box cursor="pointer" minH={"full"}>
      <Flex
        flexDir={"column"}
        justify={"space-between"}
        bg={"white"}
        px={4}
        py={3}
        borderRadius={"md"}
        minW={cardSize}
        w="full"
        minH={"full"}
        mx={2}
        grow={1}
        _hover={{
          transform: "scale(1.1)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <HStack justifyContent={"space-between"} align="flex-start">
          <Text fontSize={"md"} fontWeight="600">
            {event.title}
          </Text>
          <Flex alignItems={"baseline"}>
            <FiCalendar color="#78D8C7" />
            <Text ml={1} fontSize="sm">
              {formatDateToFrenchString(event.start_date)}
            </Text>
          </Flex>
        </HStack>
        <Link href={event.external_link as string} target={"_blank"}>
          <Flex alignItems={"center"}>
            <BiExport color="#78D8C7" />
            <Text ml={1} color="primary" textDecoration={"underline"}>
              En savoir plus
            </Text>
          </Flex>
        </Link>
      </Flex>
    </Box>
  );
};

export default EventListCard;
