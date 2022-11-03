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
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/client";

const ManageTodo = ({ isOpen, onClose, initialRef, todo, setTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setIsComplete(todo.isComplete);
    }
  }, [todo]);

  const submitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    if (description.length <= 10) {
      setErrorMessage("Description must have more than 10 characters");
      return;
    }
    setIsLoading(true);
    const user = supabaseClient.auth.user();
    let supabaseError;
    if (todo) {
      const { error } = await supabaseClient
        .from("todos")
        .update({ title, description, isComplete, user_id: user.id })
        .eq("id", todo.id);
      Router.reload();
      supabaseError = error;
    } else {
      const { error } = await supabaseClient
        .from("todos")
        .insert([{ title, description, isComplete, user_id: user.id }]);
      Router.reload();
      supabaseError = error;
    }

    setIsLoading(false);
    if (supabaseError) {
      setErrorMessage(supabaseError.message);
    } else {
      closeHandler();
    }
  };

  const closeHandler = () => {
    setTitle("");
    setDescription("");
    setIsComplete(false);
    setTodo(null);
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
          <ModalHeader>
            {todo ? "Atualizar tarefa" : "Adicionar tarefa"}
          </ModalHeader>
          <ModalCloseButton onClick={closeHandler} />
          <ModalBody pb={6}>
            {errorMessage && (
              <Alert status="error" borderRadius="lg" mb="6">
                <AlertIcon />
                <Text textAlign="center">{errorMessage}</Text>
              </Alert>
            )}
            <FormControl isRequired={true}>
              <FormLabel>Título</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Adicione seu título aqui"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
            </FormControl>

            <FormControl mt={4} isRequired={true}>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                placeholder="Adicione sua descrição aqui"
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
              <FormHelperText>
                A descrição deve ter no mínimo 10 caracteres.
              </FormHelperText>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tarefa completa?</FormLabel>
              <Switch
                isChecked={isComplete}
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
                {todo ? "Update" : "Save"}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ManageTodo;
