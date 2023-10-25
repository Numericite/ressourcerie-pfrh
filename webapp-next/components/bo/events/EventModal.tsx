import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FaTrash } from "react-icons/fa";
import * as yup from "yup";
import { TEvents } from "../../../pages/api/events/types";
import { fetchApi } from "../../../utils/api/fetch-api";

type EventModalProps = {
  event: TEvents;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const EventModal = (props: EventModalProps) => {
  const initialValues = {
    title: props.event.title,
    external_link: props.event.external_link,
    start_date: props.event.start_date,
    end_date: props.event.end_date,
  };

  const toast = useToast();
  const router = useRouter();

  if (props.event.id === undefined) {
    initialValues.title = "";
    initialValues.external_link = "";
  }

  const validationSchema = yup.object().shape({
    title: yup.string().required("Le titre est requis"),
    external_link: yup.string().required("Le lien est requis"),
    start_date: yup.date().required("La date de début est requise"),
  });

  const handleSubmit = (values: any) => {
    if (props.event.id === undefined) {
      const event = {
        title: values.title,
        external_link: values.external_link,
        start_date: values.start_date,
        end_date: values?.end_date,
      };
      if (event.end_date === "") {
        event.end_date = event.start_date;
      }
      fetchApi
        .post("/api/events/create", event)
        .then((res) => {
          toast({
            title: "L'évenement a été créé",
            description: event.title,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          props.onClose();
          router.reload();
        })
        .catch((err) => {
          toast({
            title: "Une erreur est survenue",
            description: err,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      const event = {
        id: props.event.id,
        title: values.title,
        external_link: values.external_link,
        start_date: values.start_date,
        end_date: values.end_date,
      };
      if (event.end_date === "") {
        event.end_date = event.start_date;
      }

      fetchApi
        .put("/api/events/update", event)
        .then((res) => {
          toast({
            title: "L'évenement a été modifié",
            description: event.title,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          props.onClose();
          router.reload();
        })
        .catch((err) => {
          toast({
            title: "Une erreur est survenue",
            description: err,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <Modal isOpen={props.open} onClose={props.onClose}>
      <ModalOverlay />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(formik) => {
          return (
            <Form>
              <ModalContent>
                <ModalHeader>{props.event.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl
                      isRequired={true}
                      isInvalid={
                        !!formik.errors.title &&
                        (formik.touched.title as boolean)
                      }
                    >
                      <FormLabel htmlFor="title">
                        Titre de l&apos;évenement
                      </FormLabel>
                      <Input
                        w="full"
                        type="text"
                        name="title"
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
                        !!formik.errors.external_link &&
                        (formik.touched.external_link as boolean)
                      }
                    >
                      <FormLabel htmlFor="external_link">
                        Lien externe
                      </FormLabel>
                      <Input
                        w="full"
                        type="text"
                        name="external_link"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.external_link}
                      />
                      <FormErrorMessage>
                        {formik.errors.external_link as string}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired={true}>
                      <FormLabel htmlFor="start_date">Date de début</FormLabel>
                      <Input
                        w="full"
                        type="date"
                        lang="fr"
                        name="start_date"
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          if (e.target.value) {
                            formik.setFieldValue(
                              "start_date",
                              new Date(e.target.value)
                            );
                          } else {
                            formik.setFieldValue("start_date", "");
                          }
                        }}
                        contentEditable={false}
                        value={
                          formik.values.start_date !== ""
                            ? new Date(formik.values.start_date)
                                ?.toISOString()
                                .split("T")[0]
                            : ""
                        }
                      />
                      <FormErrorMessage>
                        {formik.errors.start_date as string}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="end_date">
                        Date de fin (optionnelle)
                      </FormLabel>
                      <Input
                        w="full"
                        type="date"
                        lang="fr"
                        name="end_date"
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          if (e.target.value) {
                            formik.setFieldValue(
                              "end_date",
                              new Date(e.target.value)
                            );
                          } else {
                            formik.setFieldValue("end_date", "");
                          }
                        }}
                        value={
                          (formik.values.end_date &&
                            new Date(formik.values.end_date)
                              ?.toISOString()
                              .split("T")[0]) ||
                          ""
                        }
                      />
                      <FormErrorMessage>
                        {formik.errors.end_date as string}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack
                    w="full"
                    display={"flex"}
                    justifyContent={"space-between"}
                  >
                    {props.event.id !== undefined && (
                      <Button
                        size="sm"
                        bg="red.600"
                        cursor="pointer"
                        _hover={{
                          bg: "red.400",
                        }}
                        _active={{
                          bg: "red.300",
                        }}
                        onClick={props.onDelete}
                      >
                        <FaTrash />
                      </Button>
                    )}

                    <Button
                      cursor="pointer"
                      size="sm"
                      type="submit"
                      colorScheme="blue"
                    >
                      Enregistrer
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default EventModal;
