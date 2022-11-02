import { useDisclosure } from "@chakra-ui/hooks";
import { HStack, Box, Tag } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageTodo";
import Navbar from "../components/Navbar";
import { supabaseClient } from "../lib/client";

const Home = () => {
  const initialRef = useRef();
  const [todos, setTodos] = useState([]);

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = supabaseClient.auth.user();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    const todoListener = supabaseClient
      .from("todos")
      .on("*", (payload) => {
        const newTodo = payload.new;
        setTodos((oldTodos) => {
          const newTodos = [...oldTodos, newTodo];
          newTodo.sort((a, b) => b.id - a.id);
          return newTodos;
        });
      })
      .subscribe();

    return () => {
      todoListener.unsubscribe();
    };
  }, []);

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
        <ManageTodo isOpen={isOpen} onClose={onClose} initialRef={initialRef} />
        <HStack m="10" spacing="4" justify="center">
          <Box>
            <Tag bg="green.500" borderRadius="3xl"></Tag>
          </Box>
        </HStack>
      </main>
    </div>
  );
};

export default Home;
