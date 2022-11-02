import {
  Box,
  Divider,
  Heading,
  Text,
  Tag,
  Center,
  Button,
} from "@chakra-ui/react";

const SingleTodo = ({ todo, openHandler, deleteHandler, isDeleteLoading }) => {
  const getDateInMonthDayYear = (date) => {
    const d = new Date(date);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const n = d.toLocaleDateString("en-GB", options);
    const replace = n.replace(new RegExp(",", "g"), " ");
    return replace;
  };

  return (
    <Box
      position="relative"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      onClick={() => openHandler(todo)}
      cursor="pointer"
    >
      <Heading size="md" mt="3">
        {todo.title}
      </Heading>
      <Tag
        position="absolute"
        top="3"
        right="2"
        bg={todo.isComplete ? "blue.300" : "gray.400"}
        borderRadius="3xl"
        size="sm"
      />
      <Text color="gray.400" mt="1" fontSize="sm">
        {getDateInMonthDayYear(todo.insertedat)}
      </Text>
      <Divider my="4" />
      <Text noOfLines={[1, 2, 3]} color="gray.800">
        {todo.description}
      </Text>
      <Box display="flex" justifyContent="flex-end">
        <Button
          mt="4"
          size="sm"
          colorScheme="red"
          onClick={(event) => {
            event.stopPropagation();
            deleteHandler(todo.id);
          }}
          isDisabled={isDeleteLoading}
        >
          {" "}
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default SingleTodo;
