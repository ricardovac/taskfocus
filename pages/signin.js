import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabaseClient } from "../lib/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [alert, setAlert] = useState(false);
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true });

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabaseClient.auth.signIn({
        email,
      });
      setAlert(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeHandlerEmail = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Faça login em sua conta</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              organize suas <Link color={"blue.400"}>tarefas</Link>, foque! 💪
            </Text>
          </Stack>
          {error && (
            <Alert status="error" mb="6">
              <AlertIcon />
              <Text textAlign="center">{error}</Text>
            </Alert>
          )}
          {alert && (
            <Alert status="success">
              <AlertIcon />
              <Box>
                <AlertTitle>Sucesso!</AlertTitle>
                <AlertDescription>
                  Um Link Mágico foi enviado até a sua caixa de entrada, clique
                  neste link para obter acesso ao TaskFocus
                </AlertDescription>
              </Box>
              <CloseButton
                alignSelf="flex-start"
                position="relative"
                right={-1}
                top={-1}
                onClick={onClose}
              />
            </Alert>
          )}
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <chakra.form onSubmit={submitHandler}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="on"
                    required
                    value={email}
                    onChange={changeHandlerEmail}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    {/* <Checkbox></Checkbox> */}
                    <Link color={"blue.400"}>Esqueceu seu e-mail?</Link>
                  </Stack>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </chakra.form>
          </Box>
        </Stack>
      </Flex>
    </div>
  );
};

export default SignIn;
