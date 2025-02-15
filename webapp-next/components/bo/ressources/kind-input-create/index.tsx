import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import UploadZone from "../../../ui/form/upload";
interface KindRessourceDisplayerProps {
  kind: string;
  formik: any;
}

const KindRessourceDisplayer = (props: KindRessourceDisplayerProps) => {
  const { kind, formik } = props;

  const onRemove = () => {
    formik.setFieldValue("files", null);
  };

  const displayRessourceKindFormElement = () => {
    switch (kind) {
      case "file":
        if (formik.values.files && formik.values.files.url) {
          return (
            <Flex w="full" justify="center" h="fit-content" position="relative">
              <Box
                position="absolute"
                top={2}
                left={2}
                onClick={onRemove}
                display="flex"
                color="red.400"
                cursor="pointer"
                _hover={{
                  color: "red",
                  transition: "all 0.2s",
                  transform: "scale(1.2)",
                }}
              >
                <AiOutlineCloseCircle />
              </Box>
              <iframe
                width="90%"
                height={
                  formik.values.files.url.split(".").pop() === "pdf" ? 900 : 500
                }
                src={formik.values.files.url}
              ></iframe>
            </Flex>
          );
        } else {
          return (
            <FormControl
              isRequired={true}
              isInvalid={!!formik.errors.files && formik.touched.files}
            >
              <FormLabel htmlFor="link">Lien du fichier</FormLabel>
              <UploadZone
                width={"full"}
                onChange={formik.handleChange}
                onRemove={() => {
                  formik.setFieldValue("files", null);
                }}
                value={"files" in formik.values ? formik.values.files : null}
                name="files"
                multiple={false}
              />
              <FormErrorMessage>
                {formik.errors.files as string}
              </FormErrorMessage>
            </FormControl>
          );
        }
      case "video":
        return (
          <VStack>
            <FormControl
              isRequired={true}
              isInvalid={!!formik.errors.link && formik.touched.link}
            >
              <FormLabel htmlFor="link">Lien de la vidéo</FormLabel>
              <Input
                w="full"
                id="link"
                name="link"
                type="text"
                value={formik.values.link}
                onBlur={formik.handleBlur}
                onChange={(e) => formik.setFieldValue("link", e.target.value)}
              />
              <FormErrorMessage>
                {formik.errors.link as string}
              </FormErrorMessage>
            </FormControl>
            <HStack
              w="full"
              alignContent="flex-start"
              alignItems={"self-start"}
              justifyContent="space-between"
              justifyItems={"center"}
            >
              <FormControl
                isRequired={true}
                isInvalid={!!formik.errors.source && formik.touched.source}
              >
                <FormLabel htmlFor="source">Source</FormLabel>
                <Select
                  w="full"
                  id="source"
                  name="source"
                  value={formik.values.source}
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue("source", e.target.value)
                  }
                >
                  <option value="youtube">Youtube</option>
                  <option value="vimeo">Vimeo</option>
                </Select>
              </FormControl>
              <FormControl
                justifyItems={"center"}
                justifySelf="center"
                isRequired={true}
                isInvalid={!!formik.errors.autoplay && formik.touched.autoplay}
              >
                <FormLabel htmlFor="autoplay">Lecture automatique</FormLabel>
                <Checkbox
                  id="autoplay"
                  name="autoplay"
                  mx="50%"
                  checked={formik.values.autoplay}
                  onBlur={formik.handleBlur}
                  onChange={(e) =>
                    formik.setFieldValue("autoplay", e.target.checked)
                  }
                />
              </FormControl>
            </HStack>
          </VStack>
        );
      case "link":
        return (
          <FormControl
            isRequired={true}
            isInvalid={!!formik.errors.link && formik.touched.link}
          >
            <FormLabel htmlFor="link">Lien</FormLabel>
            <Input
              w="full"
              placeholder="Veuillez saisir le lien vers la ressource"
              id="link"
              name="link"
              type="text"
              value={formik.values.link}
              onBlur={formik.handleBlur}
              onChange={(e) => formik.setFieldValue("link", e.target.value)}
            />
            <FormErrorMessage>{formik.errors.link as string}</FormErrorMessage>
          </FormControl>
        );

      default:
        break;
    }
  };

  return <Box w="100%">{displayRessourceKindFormElement()}</Box>;
};

export default KindRessourceDisplayer;
