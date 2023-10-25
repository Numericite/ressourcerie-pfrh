import { Container, Heading } from "@chakra-ui/react";

interface Props {
  moreInfos: string;
}

const MoreActualities = (props: Props) => {
  const { moreInfos } = props;

  return (
    <Container maxW="container.2lg" my="2.125rem">
      <Heading as="h2" fontSize="2xl" mb="1.5rem">
        Mais aussi...
      </Heading>
      <div dangerouslySetInnerHTML={{ __html: moreInfos }} />
    </Container>
  );
};

export default MoreActualities;
