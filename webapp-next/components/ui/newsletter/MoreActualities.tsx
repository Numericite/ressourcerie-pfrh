import {
  Container,
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

interface Props {
  moreInfos: string;
}

const MoreActualities = (props: Props) => {
  const { moreInfos } = props;

  const [titles, setTitles] = React.useState<
    {
      title: string | null;
      subtitles: (string | null)[] | null;
    }[]
  >([]);

  React.useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(moreInfos, "text/html");

    const h1Elements = Array.from(doc.querySelectorAll("h1"));
    for (let i = 0; i < h1Elements.length; i++) {
      const title = h1Elements[i].textContent;
      const subtitles: (string | null)[] = [];
      let nextElement = h1Elements[i].nextSibling;
      while (nextElement && nextElement.nodeName !== "H1") {
        if (nextElement.nodeName === "H2") {
          subtitles.push(nextElement.textContent);
        }
        nextElement = nextElement.nextSibling;
      }
      setTitles((prev) => [
        ...prev,
        {
          title,
          subtitles,
        },
      ]);
    }
    return () => setTitles([]);
  }, []);

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
        return <Text color="neutralDark">{domToReact(domNode.children)}</Text>;
      }
      if (domNode instanceof Element && domNode.name === "img") {
        return (
          <Image
            borderRadius="xl"
            src={domNode.attribs.src}
            alt={domNode.attribs.alt}
          />
        );
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
        console.log(domNode.attribs.href);
        if (domNode.attribs.href?.includes("youtube.com")) {
          console.log("passe ici");
          const videoId = _.last(domNode.attribs.href.split("/"));
          return (
            <iframe
              width="100%"
              height="315px"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          );
        } else {
          return (
            <Link
              as="a"
              href={domNode.attribs.href}
              color="primary"
              target={"_blank"}
              textDecoration="underline"
            >
              {domToReact(domNode.children)}
            </Link>
          );
        }
      }
    },
  };

  return (
    <Container maxW="container.2lg" my="2.125rem">
      <Heading as="h2" fontSize="2xl" mb="1.5rem">
        Mais aussi...
      </Heading>
      {parse(moreInfos, options)}
    </Container>
  );
};

export default MoreActualities;
