import Head from "next/head";
import { Box } from "@chakra-ui/react";
import SignIn from "./signin";
import { useRouter } from "next/router";
import { supabaseClient } from "../lib/client";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  const user = supabaseClient.auth.getUser();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);
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
        <SignIn />
      </main>
    </div>
  );
};

export default Home;
