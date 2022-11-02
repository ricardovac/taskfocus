import { useDisclosure } from "@chakra-ui/hooks";
import { HStack, Box, Tag, SimpleGrid, Text, Center } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageTodo";
import Navbar from "../components/Navbar";
import SingleTodo from "../components/SingleTodo";
import { supabaseClient } from "../lib/client";

const Home = () => {
  const initialRef = useRef();
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState(null);

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = supabaseClient.auth.user();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      supabaseClient
        .from("todos")
        .select("*")
        .eq("user_id", user?.id)
        .order("id", { ascending: false })
        .then(({ data, error }) => {
          if (!error) {
            setTodos(data);
          }
        });
    }
  }, [user]);

  useEffect(() => {
    const todoListener = supabaseClient
      .from("todos")
      .on("*", (payload) => {
        const newTodo = payload.new;
        setTodos((oldTodos) => {
          const exists = oldTodos.find((todo) => todo.id === newTodo.id);
          let newTodos;
          if (exists) {
            const oldTodoIndex = oldTodos.findIndex(
              (obj) => obj.id === newTodo.id
            );
            oldTodos[oldTodoIndex] = newTodo;
            newTodos = oldTodos;
          } else {
            newTodos = [...oldTodos, newTodo];
          }
          newTodos.sort((a, b) => b.id - a.id);
          return newTodos;
        });
      })
      .subscribe();

    return () => {
      todoListener.unsubscribe();
    };
  }, []);

  const openHandler = (clickedTodo) => {
    setTodo(clickedTodo);
    onOpen();
  };

  return (
    <div>
      <Head>
        <title>TodoApp</title>
        <meta
          name="description"
          content="Awesome todoapp to store your awesome todos"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar onOpen={onOpen} />
        <ManageTodo
          isOpen={isOpen}
          onClose={onClose}
          initialRef={initialRef}
          todo={todo}
          setTodo={setTodo}
        />
        <HStack m="10" spacing="4" justify="center">
          <Box>
            <Tag bg="blue.300" borderRadius="3xl" size="sm" mt="0.5" /> Completo
          </Box>
          <Box>
            <Tag bg="gray.400" borderRadius="3xl" size="sm" mt="0.5" />{" "}
            Incompleto
          </Box>
        </HStack>
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 4 }}
          gap={{ base: "4", md: "6", lg: "8" }}
          m="10"
        >
          {todos.map((todo) => (
            <SingleTodo todo={todo} key={todo.id} openHandler={openHandler} />
          ))}
        </SimpleGrid>
      </main>
    </div>
  );
};

export default Home;
