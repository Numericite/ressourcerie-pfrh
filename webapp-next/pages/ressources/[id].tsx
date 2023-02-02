import { Box, Container, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import RessourceHeader from "../../components/ui/ressources/header";
import { TRessource } from "../api/ressources/types";
import { fetchApi } from "../../utils/api/fetch-api";
import RessourceMenu from "../../components/ui/ressources/ressource-menu";
import Feedback from "../../components/ui/feedback";
import RessourceSimilar from "../../components/ui/ressources/ressource-similar";
import { useMediaQueryAdapter } from "../../utils/hooks/useMediaQuery";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";
import type { Text as THTML } from "html-react-parser";
import { useEffect, useState } from "react";
import _ from "lodash";

interface Props {
  ressource: TRessource;
  similarRessources: TRessource[];
}

const RessourcePage: React.FC<Props> = ({ ressource, similarRessources }) => {
  const isLargerThan768 = useMediaQueryAdapter("(min-width: 768px)");

  const [titles, setTitles] = useState<
    {
      title: string | null;
      subtitles: (string | null)[] | null;
    }[]
  >([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(ressource.content, "text/html");

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
  }, []);

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "h1") {
        return (
          <Heading
            id={(domNode.children[0] as THTML).data.trim()}
            size="lg"
            my="1.125rem"
          >
            {(domNode.children[0] as THTML).data}
          </Heading>
        );
      }
      if (domNode instanceof Element && domNode.name === "h2") {
        return (
          <Heading
            id={(domNode.children[0] as THTML).data.trim()}
            size="md"
            my="0.765rem"
          >
            {(domNode.children[0] as THTML).data}
          </Heading>
        );
      }
      if (domNode instanceof Element && domNode.name === "p") {
        return (
          <Text color="neutralDark">
            {(domNode.children[0] as THTML)?.data}
          </Text>
        );
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
    },
  };

  const ressourceBody = <Box>{parse(ressource.content, options)}</Box>;

  return (
    <Box w="full">
      <RessourceHeader
        title={ressource.name}
        description={ressource.description}
        kind={ressource.kind}
      />
      <Container maxW="container.2lg" my="2.125rem">
        <Flex justifyItems={"space-between"}>
          {isLargerThan768 && (
            <Box w="100%" pr={"1.5rem"}>
              {ressourceBody}
            </Box>
          )}
          <Box flexDir={"column"} minW="auto">
            <RessourceMenu
              ressource={ressource}
              titles={_.uniq(
                titles.map((el) => {
                  return {
                    title: el.title,
                    subtitles: el.subtitles,
                  };
                })
              )}
            />
            {!isLargerThan768 && (
              <Box w="100%" px={"1.5rem"}>
                {ressourceBody}
              </Box>
            )}
          </Box>
        </Flex>
      </Container>
      <Feedback id={ressource.id} />
      <RessourceSimilar similarRessources={similarRessources} />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const res = await fetchApi
    .get("/api/ressources/find", { id: parseInt(id as string) })
    .then((response) => {
      return response;
    });

  const theme = res.theme;
  const similarRes = await fetchApi
    .get("/api/ressources/list", {
      pagination: { page: 1, pageSize: 12 },
      filters: { theme: theme.id },
    })
    .then((response) => {
      return response.data;
    });

  return {
    props: {
      ressource: res,
      similarRessources: similarRes,
    },
  };
};

export default RessourcePage;
