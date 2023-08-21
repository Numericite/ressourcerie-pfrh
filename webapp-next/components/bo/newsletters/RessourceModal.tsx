import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Thead,
  Tr,
  Th,
  ModalCloseButton,
  Tbody,
  Td,
  Tag,
  Container,
  Checkbox,
  Tfoot,
  Flex,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import { TRessource } from "../../../pages/api/ressources/types";
import IconPlaceHolder from "../../ui/icon-placeholder";
import Loader from "../../ui/loader";

interface RessourceModalProps {
  isModalVisible: boolean | undefined;
  setIsModalVisible: (isVisible: boolean) => void;
  ressources: TRessource[];
  selectedRessources: TRessource[];
  handleSelectedRessources: (ressource: TRessource) => void;
  page: number;
  handleArrowPress: (page: number) => void;
  loading?: boolean;
}

const RessourceModal = (props: RessourceModalProps) => {
  const {
    isModalVisible,
    setIsModalVisible,
    ressources,
    selectedRessources,
    handleSelectedRessources,
    page,
    handleArrowPress,
    loading,
  } = props;

  const tablehead = ["", "Nom", "Type", "Theme"];

  if (!ressources) return <Loader />;

  return (
    <Modal
      isOpen={isModalVisible as boolean}
      onClose={() => setIsModalVisible(false)}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Selectionnez les ressources à ajouter à la newsletter
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mt={[0, 10]}>
          {loading ? (
            <Loader />
          ) : (
            <Container maxW="container.lg">
              <Table size="sm">
                <Thead>
                  <Tr>
                    {tablehead.map((head, index) => {
                      return <Th key={index}>{head}</Th>;
                    })}
                  </Tr>
                </Thead>
                <Tbody>
                  {ressources.map((ressource, index) => (
                    <Tr
                      key={index}
                      bg={
                        selectedRessources?.find(
                          (selected) => selected.id === ressource.id
                        )
                          ? "#2f6cff33"
                          : ""
                      }
                      onClick={() => handleSelectedRessources(ressource)}
                    >
                      <Td>
                        <Checkbox
                          size="sm"
                          isChecked={
                            selectedRessources?.find(
                              (selected) => selected.id === ressource.id
                            )
                              ? true
                              : false
                          }
                        />
                      </Td>
                      <Td>{ressource.name}</Td>
                      <Td>
                        <IconPlaceHolder kind={ressource.kind} />
                      </Td>
                      <Td>
                        <Tag
                          fontSize={{ base: "xs", sm: "xs" }}
                          variant="subtle"
                          colorScheme={ressource.theme?.color || "gray"}
                        >
                          {ressource.theme?.name}
                        </Tag>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Td colSpan={4}>
                      <Flex justify={"center"}>
                        <Button
                          mr={3}
                          size="sm"
                          isDisabled={page === 1}
                          onClick={() => handleArrowPress(-1)}
                        >
                          <ArrowBackIcon />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleArrowPress(1)}
                          isDisabled={ressources.length < 10}
                        >
                          <ArrowForwardIcon />
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                </Tfoot>
              </Table>
            </Container>
          )}
        </ModalBody>
        <ModalFooter>
          {selectedRessources.length > 0 && (
            <Button size="sm" onClick={() => setIsModalVisible(false)}>
              Valider la selection de {selectedRessources.length} ressource(s)
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RessourceModal;
