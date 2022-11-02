import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabaseClient } from "../lib/client";

const ManageTodo = ({ isOpen, onClose, initialRef }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    if (description.length <= 10) {
      setErrorMessage("Description must have more than 10 characters");
      return;
    }
    setIsLoading(true);
    const user = supabaseClient.auth.getUser();
    const { error } = await supabaseClient
      .from("todos")
      .insert([{ title, description, isComplete, user_id: user.id }]);
    setIsLoading(false);
    if (error) {
      setErrorMessage(error.message);
    } else {
      closeHandler();
    }
  };

  const closeHandler = () => {
    setTitle("");
    setDescription("");
    setIsComplete(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={submitHandler}>
          <ModalHeader>Add Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {errorMessage && (
              <Alert status="error" borderRadius="lg" mb="6">
                <AlertIcon />
                <Text textAlign="center">{errorMessage}</Text>
              </Alert>
            )}
            <FormControl isRequired={true}>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Add your title here"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
            </FormControl>

            <FormControl mt={4} isRequired={true}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Add your description here"
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
              <FormHelperText>
                Description must have more than 10 characters.
              </FormHelperText>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Is Completed?</FormLabel>
              <Switch
                value={isComplete}
                id="is-completed"
                onChange={(event) => setIsComplete(!isComplete)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup spacing="3">
              <Button
                onClick={closeHandler}
                colorScheme="red"
                type="reset"
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                Save
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ManageTodo;
