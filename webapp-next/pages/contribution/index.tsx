import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik, FormikErrors, FormikValues } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import ContributionHeader from "../../components/ui/headers/contribution";
import { fetchApi } from "../../utils/api/fetch-api";
import { TTheme } from "../api/themes/types";
import * as Yup from "yup";
import {
  ressourceKindEnum,
  displayKindReadable,
} from "../../utils/globals/enums";
import { TContributionCreationPayload } from "../api/contributions/types";
import UploadZone from "../../components/ui/form/upload";
import axios from "axios";

interface Field {
  key: string;
  name: string;
  kind: string;
  label: string;
  placeholder: string;
  required: boolean;
  options?: TTheme[] | typeof ressourceKindEnum;
}

const Contributions: React.FC = () => {
  const [themes, setThemes] = useState<TTheme[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allDisabled, setAllDisabled] = useState<boolean>();
  const toast = useToast();

  const fetchThemes = () => {
    return fetchApi
      .get("/api/themes/list", { pagination: { page: 1, pageSize: 1000 } })
      .then((response) => {
        setThemes(response.data);
      });
  };

  useEffect(() => {
    setAllDisabled(false);
    fetchThemes();
  }, []);

  const fields: Field[] = [
    {
      key: "first_name",
      name: "first_name",
      kind: "text",
      label: "Prénom",
      placeholder: "Votre prénom",
      required: false,
    },
    {
      key: "last_name",
      name: "last_name",
      kind: "text",
      label: "Nom",
      placeholder: "Votre nom",
      required: false,
    },
    {
      key: "job_title",
      name: "job_title",
      kind: "text",
      label: "Fonction",
      placeholder: "Votre fonction",
      required: false,
    },
    {
      key: "email",
      name: "email",
      kind: "text",
      label: "Adresse email",
      placeholder: "Votre adresse email",
      required: true,
    },
    {
      key: "theme",
      name: "theme",
      kind: "select",
      label: "Thématique",
      placeholder: "Choisissez une thématique",
      required: false,
      options: themes,
    },
    {
      key: "description",
      name: "description",
      kind: "textarea",
      label: "Description de votre ressource",
      placeholder: "Veuillez saisir une description",
      required: true,
    },
    {
      key: "link",
      name: "link",
      kind: "text",
      label: "Lien",
      placeholder: "Lien vers la ressource",
      required: false,
    },
    {
      key: "files",
      name: "files",
      kind: "file",
      label: "Fichiers",
      placeholder: "Veuillez sélectionner un fichier",
      required: false,
    },
  ];

  const initialValues = {
    first_name: "",
    last_name: "",
    job_title: "",
    theme: themes[0],
    description: "",
    email: "",
    link: "",
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string(),
    last_name: Yup.string(),
    job_title: Yup.string(),
    theme: Yup.object(),
    email: Yup.string()
      .email("Email invalide")
      .required("L'email est obligatoire"),
    description: Yup.string().required("La description est obligatoire"),
  });

  const handleSubmit = async (values: TContributionCreationPayload) => {
    values.status = "pending";
    setIsLoading(true);
    let contributionId, tmpFiles, tmpContrib;
    if (values.theme === undefined) {
      values.theme = themes[0];
    }
    if (values.files) {
      const { files, ...contributionWithoutFiles } = values;
      tmpFiles = files;
      tmpContrib = contributionWithoutFiles;
    }
    try {
      const response = await fetchApi.post(
        "/api/contributions/create",
        tmpContrib || values
      );
      contributionId = response.id;
      if (tmpFiles && contributionId) {
        const formData = new FormData();
        formData.append("files", tmpFiles as unknown as File);
        formData.append("ref", "api::contribution.contribution");
        formData.append("refId", contributionId.toString());
        formData.append("field", "files");
        await axios.post(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
          formData
        );
      }
      setIsLoading(false);
      setAllDisabled(true);
      toast({
        title: "Votre contribution a été soumise avec succès !",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Une erreur est survenue",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const displayField = (
    field: Field,
    values: FormikValues,
    handleChange: (e: ChangeEvent<any>) => void,
    handleBlur: any,
    setFieldValue: any,
    errors: FormikErrors<FormikValues>,
    touched: any
  ) => {
    switch (field.kind) {
      case "select":
        return (
          <GridItem key={field.key} colSpan={2}>
            <FormControl
              isDisabled={allDisabled}
              isRequired={field.required}
              isInvalid={touched[field.name] && errors[field.name]}
            >
              <FormLabel color="#204064" fontWeight={"bold"}>
                {field.label}
              </FormLabel>
              <Select
                key={field.name}
                w="full"
                name={field.name}
                placeholder={field.placeholder}
                value={values[field.name]?.name}
                onChange={
                  field.key === "theme"
                    ? (e) =>
                        setFieldValue(
                          "theme",
                          themes.find((theme) => theme.name === e.target.value)
                        )
                    : handleChange
                }
                required={field.required}
                onBlur={handleBlur}
              >
                {field.options?.map((option: any) => (
                  <option key={option.id} value={option.name}>
                    {field.key === "ressource_kind"
                      ? displayKindReadable(option)
                      : option.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors[field.name] as string}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        );

      case "textarea":
        return (
          <GridItem key={field.key} colSpan={[1, 1, 3]}>
            <FormControl
              isDisabled={allDisabled}
              isRequired={field.required}
              isInvalid={touched[field.name] && errors[field.name]}
            >
              <FormLabel color="#204064" fontWeight={"bold"}>
                {field.label}
              </FormLabel>
              <Textarea
                key={field.name}
                w="full"
                name={field.name}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={handleChange}
                required={field.required}
                onBlur={handleBlur}
              />
              <FormErrorMessage>
                {errors[field.name] as string}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        );

      case "text":
        return (
          <GridItem key={field.key} colSpan={field.name === "link" ? 3 : 1}>
            <FormControl
              isDisabled={allDisabled}
              isRequired={field.required}
              isInvalid={touched[field.name] && errors[field.name]}
            >
              <FormLabel color="#204064" fontWeight={"bold"}>
                {field.label}
              </FormLabel>
              <Input
                key={field.name}
                w="full"
                name={field.name}
                placeholder={field.placeholder}
                type={field.kind}
                value={values[field.name]}
                onChange={handleChange}
                required={field.required}
                onBlur={handleBlur}
              />
              <FormErrorMessage>
                {errors[field.name] as string}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        );
      case "file":
        return (
          <GridItem key={field.key} colSpan={[1, 2, 3]}>
            <FormControl
              isDisabled={allDisabled}
              isRequired={field.required}
              isInvalid={touched[field.name] && errors[field.name]}
            >
              <FormLabel color="#204064" fontWeight={"bold"}>
                {field.label}
              </FormLabel>
              <UploadZone
                onChange={handleChange}
                value={values[field.name]}
                name={field.name}
                multiple={true}
                width="100%"
                onRemove={() => {
                  setFieldValue("files", null);
                }}
              />
              <FormErrorMessage>
                {errors[field.name] as string}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        );
      default:
        break;
    }
  };

  return (
    <Box w="full">
      <ContributionHeader />
      <Container maxW="container.2lg">
        <Formik
          initialValues={initialValues}
          fields={fields}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <Flex
                justifyContent="space-between"
                flexDir={"column"}
                alignItems="center"
              >
                <SimpleGrid
                  columns={[1, 2, 3]}
                  w="full"
                  gap={10}
                  pt={"3.375rem"}
                >
                  {fields.map((field) => {
                    return displayField(
                      field,
                      values,
                      handleChange,
                      handleBlur,
                      setFieldValue,
                      errors,
                      touched
                    );
                  })}
                </SimpleGrid>
                <Button
                  mt="2.75rem"
                  mb="3.375rem"
                  type="submit"
                  disabled={allDisabled}
                >
                  <Text mr={3}>Envoyer ma contribution</Text>
                  <ArrowForwardIcon />
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
};

export default Contributions;
