import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "../lib/theme"
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  <ChakraProvider>
    return <Component {...pageProps} />
  </ChakraProvider>;
}

export default MyApp;
