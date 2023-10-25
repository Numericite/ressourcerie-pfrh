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
    const event = {
      id: props.event.id,
      title: values.title,
      external_link: values.external_link,
      start_date: values.start_date,
    };
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
                          formik.setFieldValue(
                            "start_date",
                            new Date(e.target.value)
                          );
                        }}
                        value={
                          formik.values.start_date &&
                          new Date(formik.values.start_date)
                            ?.toISOString()
                            .split("T")[0]
                        }
                      />
                      <FormErrorMessage>
                        {formik.errors.start_date as string}
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
                    <Button
                      size="sm"
                      bg="red"
                      _hover={{
                        bg: "red.500",
                      }}
                      onClick={props.onDelete}
                    >
                      <FaTrash />
                      <Text ml={2}>Supprimer</Text>
                    </Button>

                    <Flex>
                      <Button size="sm" type="submit" colorScheme="blue">
                        Enregistrer
                      </Button>
                    </Flex>
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
