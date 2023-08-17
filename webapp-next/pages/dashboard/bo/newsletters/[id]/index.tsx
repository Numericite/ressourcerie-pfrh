import {
  Box,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import BackButton from "../../../../../components/ui/back-button/back-button";
import Loader from "../../../../../components/ui/loader";
import { fetchApi } from "../../../../../utils/api/fetch-api";
import * as yup from "yup";
import {
  TNewsLetter,
  TNewsLetterCreationPayload,
  TNewsLetterUpdatePayload,
} from "../../../../api/newsletters/types";

const NewsLetterCreate = () => {
  const router = useRouter();
  const { id } = router.query;
  const [newsLetter, setNewsLetter] = React.useState<TNewsLetter>();
  const [isLoading, setIsLoading] = React.useState<boolean>();

  let initialValues: TNewsLetterCreationPayload | TNewsLetterUpdatePayload = {
    title: "",
    description: "",
    ressources: [],
  };

  if (newsLetter && newsLetter.id) {
    initialValues = {
      title: newsLetter.title,
      description: newsLetter.description,
      ressources: newsLetter.ressources,
    };
  }

  const validationSchema = yup.object().shape({
    title: yup.string().required("Le titre est requis"),
    description: yup.string().required("La description est requise"),
    ressources: yup.array().required("Les ressources sont requises"),
  });

  const validate = async (
    tmpNewsLetter: TNewsLetterCreationPayload | TNewsLetterUpdatePayload
  ) => {};

  const fetchNewsletter = async (id: string) => {
    setIsLoading(true);
    try {
      fetchApi
        .get("/api/newsletters/find", { id: parseInt(id as string) })
        .then((res) => {
          setNewsLetter(res);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (id && id !== "new") {
      fetchNewsletter(id as string);
    }
  }, [id]);

  if ((id !== "new" && !newsLetter) || isLoading) return <Loader />;

  return (
    <>
      <Box mb={4}>
        <BackButton />
      </Box>
      <Container maxW="container.2lg">
        {id === "new" ? (
          <Heading>Créer une newsletter</Heading>
        ) : (
          <Heading>
            Modifier la newsletter{" "}
            <Text
              as="span"
              bgGradient="linear(to-t, #97F8B1, #2F80ED)"
              bgClip="text"
            >
              {newsLetter?.title}
            </Text>
          </Heading>
        )}
        <Box mt={8}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={validate}
          >
            {(formik) => {
              return (
                <Form>
                  <Stack spacing={6}>
                    <FormControl
                      isRequired={true}
                      isInvalid={
                        !!formik.errors.title &&
                        (formik.touched.title as boolean)
                      }
                    >
                      <FormLabel htmlFor="title">
                        Titre de la newsletter
                      </FormLabel>
                      <Input
                        w="full"
                        id="title"
                        name="title"
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.title}
                      />
                      <FormErrorMessage>
                        {formik.errors.title as string}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired={true}
                      isInvalid={
                        !!formik.errors.description &&
                        (formik.touched.description as boolean)
                      }
                    >
                      <FormLabel htmlFor="description">
                        Description de la newsletter
                      </FormLabel>
                      <Textarea
                        w="full"
                        id="description"
                        name="description"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                      />
                      <FormErrorMessage>
                        {formik.errors.description as string}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Container>
    </>
  );
};

export default NewsLetterCreate;
