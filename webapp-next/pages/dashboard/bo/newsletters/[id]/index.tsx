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
import axios from "axios";
import { getJwt } from "../../../../../utils/globals/cookies";
import { useDebounce } from "usehooks-ts";

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
  const [search, setSearch] = React.useState<string>("");
  const debounceSearch = useDebounce(search, 700);

  const toast = useToast();

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

  const jwt = getJwt();

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${res.data[0].url}`;
  };

  //Initiate bottom Editor for external content due to NextJS SSR Constraints with Quill. So we use this useEffect in order to load Quill only when document is defined on client side.
  const [editorLoaded, setEditorLoaded] = React.useState<boolean>(false);
  const ReactQuill = React.useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const modules = React.useRef<any>();
  const formats = React.useRef<any>([
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
  ]);

  React.useEffect(() => {
    (async () => {
      const quill = await import("react-quill");
      const ImageUploader = await import("quill-image-uploader");
      const ImageResize = await import("quill-image-resize-module-react");
      quill.default.Quill.register(
        "modules/imageUploader",
        ImageUploader.default
      );
      quill.default.Quill.register("modules/imageResize", ImageResize.default);
      formats.current = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
        "color",
        "background",
        "align",
      ];
      modules.current = {
        toolbar: toolbarOptions,
        imageUploader: {
          upload: (file: File) => handleImageUpload(file),
        },
        imageResize: {
          modules: ["Resize", "Toolbar"],
          parchment: quill.default.Quill.import("parchment"),
        },
      };
      setEditorLoaded(true);
    })();
  }, []);

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
          _q: search,
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
  }, [isModalVisible, page, debounceSearch]);

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

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
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
                    <FormControl isRequired={false}>
                      <FormLabel htmlFor="description">
                        Sous titre de la newsletter
                      </FormLabel>
                      <Input
                        w="full"
                        id="description"
                        name="description"
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                      />
                      <FormErrorMessage>
                        {formik.errors.description as string}
                      </FormErrorMessage>
                    </FormControl>
                    <Text>
                      Sélectionnez les ressources à afficher dans la newsletter
                      :{" "}
                    </Text>
                    <Button size="sm" onClick={() => setIsModalVisible(true)}>
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
                        onSearch={(e) => {
                          handleSearch(e);
                        }}
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
                        {({ field }: any) =>
                          field.name && (
                            <Box my={2}>
                              {editorLoaded && (
                                <ReactQuill
                                  preserveWhitespace={true}
                                  theme="snow"
                                  modules={modules.current}
                                  formats={formats.current}
                                  onChange={field.onChange(field.name)}
                                  value={formik.values.external_content}
                                />
                              )}
                            </Box>
                          )
                        }
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
