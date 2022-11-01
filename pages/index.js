import Head from "next/head";
import { Box } from "@chakra-ui/react";

const Home = () => {
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
        <Box>Hello world</Box>
      </main>
    </div>
  );
};

export default Home;
