import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchbarProps } from "./interface";

const UISearchbar = (props: SearchbarProps) => {
  return (
    <InputGroup w={props.w ? props.w : "full"} size={props.size}>
      <Input
        w="full"
        bgColor="neutral.900"
        borderRadius="2xl"
        size={props.size}
        placeholder={props.placeholder}
        onChange={props.onSearch}
      />
      <InputRightElement>
        <SearchIcon color="neutral.500" />
      </InputRightElement>
    </InputGroup>
  );
};

export default UISearchbar;
