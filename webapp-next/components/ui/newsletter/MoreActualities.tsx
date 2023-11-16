import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
} from "html-react-parser";
import React from "react";
import type { Text as THTML } from "html-react-parser";
import _ from "lodash";
import { getYoutubeIdFromFullUrl } from "../../../utils/globals/tools";
import { cssStringToObject } from "../../../utils/tools";

interface Props {
  moreInfos: string;
}

const MoreActualities = (props: Props) => {
  const { moreInfos } = props;

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "h1") {
        return (
          <Heading
            id={(domNode.children[0] as THTML).data?.trim()}
            size="md"
            my="1.125rem"
          >
            {domToReact(domNode.children)}
          </Heading>
        );
      }
      if (domNode instanceof Element && domNode.name === "h2") {
        return (
          <Heading
            id={(domNode.children[0] as THTML).data?.trim()}
            size="sm"
            my="0.765rem"
          >
            {domToReact(domNode.children)}
          </Heading>
        );
      }
      if (domNode instanceof Element && domNode.name === "p") {
        if (
          domNode.children[0] instanceof Element &&
          domNode.children[0].name === "a"
        ) {
          if (domNode.children[0].attribs.href?.includes("youtube.com")) {
            return (
              <Box w={["100%", "70%"]} h={["250", "350"]}>
                <iframe
                  width={"100%"}
                  height={"100%"}
                  src={`https://www.youtube.com/embed/${getYoutubeIdFromFullUrl(
                    domNode.children[0].attribs.href
                  )}?modestbranding=1&autohide=1&showinfo=0&controls=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </Box>
            );
          }
        } else if (
          domNode.children[0] instanceof Element &&
          domNode.children[0].name === "img"
        ) {
          return (
            <Text color="neutralDark">{domToReact(domNode.children)}</Text>
          );
        }
      }
      if (domNode instanceof Element && domNode.name === "blockquote") {
        return <Text color="neutralDark">{domToReact(domNode.children)}</Text>;
      }
      if (domNode instanceof Element && domNode.name === "ul") {
        return (
          <UnorderedList pl={4}>
            {domNode.children.map((child, index) => {
              if (child instanceof Element && child.name === "li") {
                return (
                  <ListItem color="neutralDark" key={index}>
                    {domToReact(child.children)}
                  </ListItem>
                );
              }
            })}
          </UnorderedList>
        );
      }
      if (domNode instanceof Element && domNode.name === "ol") {
        return (
          <OrderedList pl={4}>
            {domNode.children.map((child, index) => {
              if (child instanceof Element && child.name === "li") {
                return (
                  <ListItem color="neutralDark" key={index}>
                    {domToReact(child.children)}
                  </ListItem>
                );
              }
            })}
          </OrderedList>
        );
      }
      if (domNode instanceof Element && domNode.name === "a") {
        return (
          <Link
            as="a"
            fontWeight={600}
            href={domNode.attribs.href}
            color="primary"
            target={"_blank"}
            textDecoration="underline"
          >
            {domToReact(domNode.children)}
          </Link>
        );
      }
    },
  };

  return (
    <Container maxW="container.2lg" my="2.125rem" minH="fit-content">
      <Heading as="h2" fontSize="2xl" mb="1.5rem">
        Mais aussi...
      </Heading>
      {parse(moreInfos, options)}
    </Container>
  );
};

export default MoreActualities;
