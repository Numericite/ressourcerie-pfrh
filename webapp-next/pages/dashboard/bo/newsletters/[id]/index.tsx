import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
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
import { TRessource } from "../../../../api/ressources/types";
import RessourceModal from "../../../../../components/bo/newsletters/RessourceModal";
import RessourcesDisplayer from "../../../../../components/bo/newsletters/RessourcesDisplayer";
import "react-quill/dist/quill.bubble.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const NewsLetterCreate = () => {
  const router = useRouter();
  const { id } = router.query;
  const [newsLetter, setNewsLetter] = React.useState<TNewsLetter>();
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isMainPageLoading, setIsMainPageLoading] = React.useState<boolean>();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>();
  const [ressources, setRessources] = React.useState<TRessource[]>();
  const [selectedRessources, setSelectedRessources] = React.useState<
    Array<TRessource>
  >([]);
  const [page, setPage] = React.useState<number>(1);

  const toast = useToast();

  let initialValues: TNewsLetterCreationPayload | TNewsLetterUpdatePayload = {
    title: "",
    description: "",
    ressources: [],
    status: "draft",
  };

  if (newsLetter && newsLetter.id) {
    initialValues = {
      title: newsLetter.title,
      description: newsLetter.description,
      ressources: newsLetter.ressources,
      status: newsLetter.status,
    };
  }

  const validationSchema = yup.object().shape({
    title: yup.string().required("Le titre est requis"),
    description: yup.string().required("Le contenu est requis"),
    ressources: yup.array().required("Les ressources sont requises"),
  });

  const validate = async (
    tmpNewsLetter: TNewsLetterCreationPayload | TNewsLetterUpdatePayload
  ) => {
    setIsMainPageLoading(true);
    if (selectedRessources.length > 0) {
      tmpNewsLetter.ressources = selectedRessources;
    }
    try {
      if (id === "new") {
        fetchApi.post("/api/newsletters/create", tmpNewsLetter).then((res) => {
          router.push("/dashboard/bo/newsletters");
        });
      } else {
        fetchApi
          .put("/api/newsletters/update", {
            id: newsLetter?.id,
            ...tmpNewsLetter,
          })
          .then((res) => {
            router.push("/dashboard/bo/newsletters");
          });
      }
    } catch (err) {
      toast({
        title: `Erreur lors de la ${
          "id" in tmpNewsLetter ? "modification" : "création"
        } de ${tmpNewsLetter.title}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchNewsletter = async (id: string) => {
    setIsMainPageLoading(true);
    try {
      fetchApi
        .get("/api/newsletters/find", { id: parseInt(id as string) })
        .then((res) => {
          setNewsLetter(res);
          setIsMainPageLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRessources = async () => {
    setIsLoading(true);
    try {
      fetchApi
        .get("/api/ressources/list", {
          pagination: {
            page,
            pageSize: 10,
          },
          sort: {
            createdAt: "desc",
          },
        })
        .then((res) => {
          setRessources(res.data);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (isModalVisible) {
      fetchRessources();
    }
  }, [isModalVisible, page]);

  React.useEffect(() => {
    if (id && id !== "new") {
      fetchNewsletter(id as string);
    }
  }, [id]);

  React.useEffect(() => {
    if (newsLetter) {
      setSelectedRessources(newsLetter.ressources);
    }
  }, [newsLetter]);

  const handleSelectedRessources = (ressource: TRessource) => {
    if (selectedRessources?.find((r) => r.id === ressource.id)) {
      setSelectedRessources(
        selectedRessources.filter((r) => r.id !== ressource.id)
      );
    } else {
      setSelectedRessources([...selectedRessources, ressource]);
    }
  };

  const handlePagination = (value: number) => {
    if (value === -1 && page > 1) setPage(page - 1);
    if (value === 1) setPage(page + 1);
  };

  if ((id !== "new" && !newsLetter) || isMainPageLoading) return <Loader />;

  return (
    <>
      <Box mb={4}>
        <BackButton />
      </Box>
      <Container maxW="container.lg">
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
                        Accroche de la newsletter
                      </FormLabel>
                      <Field
                        touched={formik.touched.description}
                        name="description"
                        onBlur={formik.handleBlur}
                      >
                        {({ field }: any) => (
                          <>
                            <ReactQuill
                              style={{
                                border: "1px solid #CBD5E0",
                                borderRadius: "4px",
                              }}
                              preserveWhitespace={true}
                              theme="bubble"
                              onChange={field.onChange(field.name)}
                              value={formik.values.description}
                            />
                          </>
                        )}
                      </Field>
                      <FormErrorMessage>
                        {formik.errors.description as string}
                      </FormErrorMessage>
                    </FormControl>
                    <Button
                      size="sm"
                      onClick={() => setIsModalVisible(true)}
                      variant="solid"
                    >
                      {selectedRessources?.length > 0
                        ? "Modifier les ressources"
                        : "Ajouter une ressource"}
                    </Button>
                    {isModalVisible && (
                      <RessourceModal
                        loading={isLoading}
                        page={page}
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        ressources={ressources as TRessource[]}
                        selectedRessources={selectedRessources as TRessource[]}
                        handleSelectedRessources={handleSelectedRessources}
                        handlePagination={handlePagination}
                      />
                    )}
                    {selectedRessources?.length > 0 && (
                      <RessourcesDisplayer ressources={selectedRessources} />
                    )}
                  </Stack>
                  {selectedRessources.length > 0 && (
                    <Button
                      onClick={() => formik.handleSubmit()}
                      isLoading={formik.isSubmitting}
                      size="md"
                      my={2}
                    >
                      Enregistrer
                    </Button>
                  )}
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
