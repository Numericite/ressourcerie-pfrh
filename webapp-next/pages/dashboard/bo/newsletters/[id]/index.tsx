import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
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
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import DragNDropComponent from "../../../../../components/bo/usecases/dragndrop";
import RessourceCard from "../../../../../components/ui/ressources/ressource-card";
import { AiFillCloseCircle } from "react-icons/ai";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export type TSelectedRessource = {
  position: number;
  ressource: TRessource;
};

const NewsLetterCreate = () => {
  const router = useRouter();
  const { id } = router.query;
  const [newsLetter, setNewsLetter] = React.useState<TNewsLetter>();
  const [isLoading, setIsLoading] = React.useState<boolean>();
  const [isMainPageLoading, setIsMainPageLoading] = React.useState<boolean>();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>();
  const [ressources, setRessources] = React.useState<TRessource[]>();
  const [selectedRessources, setSelectedRessources] = React.useState<
    Array<TSelectedRessource>
  >([]);
  const [page, setPage] = React.useState<number>(1);
  const [hoveredCardId, setHoveredCardId] = React.useState<number>();

  const toast = useToast();

  let initialValues: TNewsLetterCreationPayload | TNewsLetterUpdatePayload = {
    title: "",
    description: "",
    ressources_list: [],
    status: "draft",
    external_content: "",
  };

  if (newsLetter && newsLetter.id) {
    initialValues = {
      title: newsLetter.title,
      description: newsLetter.description,
      ressources_list: newsLetter.ressources_list,
      status: newsLetter.status,
      external_content: newsLetter.external_content,
    };
  }

  const validationSchema = yup.object().shape({
    title: yup.string().required("Le titre est requis"),
    description: yup.string().required("Le contenu est requis"),
    ressources_list: yup.array().required("Les ressources sont requises"),
  });

  const validate = async (
    tmpNewsLetter: TNewsLetterCreationPayload | TNewsLetterUpdatePayload
  ) => {
    setIsMainPageLoading(true);
    if (selectedRessources.length > 0) {
      tmpNewsLetter.ressources_list = selectedRessources;
    }
    try {
      if (id === "new") {
        fetchApi.post("/api/newsletters/create", tmpNewsLetter).then((res) => {
          router.push("/dashboard/bo/newsletters");
        });
      } else {
        if (newsLetter)
          fetchApi
            .put("/api/newsletters/update", {
              id: newsLetter.id,
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
        .get("/api/newsletters/find", {
          id: parseInt(id as string),
          populate: {
            ressources_list: { populate: ["ressource"] },
          },
        })
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
      setSelectedRessources(newsLetter.ressources_list);
    }
  }, [newsLetter]);

  const handleSelectedRessources = (ressource: TRessource) => {
    if (
      selectedRessources.find(
        (selectedRessource) => selectedRessource.ressource.id === ressource.id
      )
    ) {
      setSelectedRessources(
        selectedRessources.filter(
          (selectedRessource) => selectedRessource.ressource.id !== ressource.id
        )
      );
    } else {
      setSelectedRessources([
        ...selectedRessources,
        {
          position: selectedRessources.length + 1,
          ressource,
        },
      ]);
    }
  };

  const handlePagination = (value: number) => {
    if (value === -1 && page > 1) setPage(page - 1);
    if (value === 1) setPage(page + 1);
  };

  const handleCardPosition = (items: TSelectedRessource[]) => {
    let adjustedItems = items.map((item, index) => {
      return {
        ...item,
        position: index + 1,
      };
    });
    setSelectedRessources(adjustedItems);
  };

  const displayDeleteButton = (item: TRessource) => {
    return (
      <Box
        position="absolute"
        top={2}
        right={2}
        w={4}
        h={4}
        borderRadius={50}
        zIndex={1}
        bg="red.500"
        cursor="pointer"
        onClick={() =>
          setSelectedRessources(
            selectedRessources.filter((res) => res.ressource.id !== item.id)
          )
        }
      >
        <AiFillCloseCircle color="white" />
      </Box>
    );
  };

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"], // remove formatting button
  ];

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
                          <Box my={2}>
                            <ReactQuill
                              preserveWhitespace={true}
                              theme="snow"
                              onChange={field.onChange(field.name)}
                              value={formik.values.description}
                            />
                          </Box>
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
                        selectedRessources={
                          selectedRessources as TSelectedRessource[]
                        }
                        handleSelectedRessources={handleSelectedRessources}
                        handlePagination={handlePagination}
                      />
                    )}
                    {selectedRessources.length > 0 && (
                      <>
                        <Text fontStyle={"italic"} fontSize="sm" my={0} py={0}>
                          Ordonnez les ressources sélectionnées à votre
                          convenance :
                        </Text>
                        <DragNDropComponent
                          items={selectedRessources}
                          dropppableId="ressources-list"
                          setItems={handleCardPosition}
                          element={(item) => (
                            <Box
                              onMouseEnter={() =>
                                setHoveredCardId(item.ressource.id)
                              }
                              onMouseLeave={() => setHoveredCardId(undefined)}
                              w="full"
                              h="full"
                              position="relative"
                            >
                              <RessourceCard
                                ressource={item.ressource}
                                position={
                                  1 +
                                  selectedRessources.findIndex(
                                    (res) =>
                                      res.ressource.id === item.ressource.id
                                  )
                                }
                                clickable={false}
                              />
                              {hoveredCardId === item.ressource.id &&
                                displayDeleteButton(item.ressource)}
                            </Box>
                          )}
                        />
                      </>
                    )}
                    <FormControl isRequired={false}>
                      <FormLabel htmlFor="external_content">
                        Actualités externes à partager
                      </FormLabel>
                      <Field
                        touched={formik.touched.external_content}
                        name="external_content"
                        onBlur={formik.handleBlur}
                      >
                        {({ field }: any) => (
                          <Box my={2}>
                            <ReactQuill
                              preserveWhitespace={true}
                              theme="snow"
                              modules={{ toolbar: toolbarOptions }}
                              onChange={field.onChange(field.name)}
                              value={formik.values.external_content}
                            />
                          </Box>
                        )}
                      </Field>
                      <FormErrorMessage>
                        {formik.errors.external_content as string}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                  {selectedRessources.length > 0 && (
                    <Flex justifyContent={"center"}>
                      <Button
                        onClick={() => formik.handleSubmit()}
                        isLoading={formik.isSubmitting}
                        size="md"
                        my={4}
                      >
                        Enregistrer
                      </Button>
                    </Flex>
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
