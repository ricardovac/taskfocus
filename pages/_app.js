import { ChakraProvider, useFocusEffect } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { use, useEffect } from "react";
import { supabaseClient } from "../lib/client";
import customTheme from "../lib/theme";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const user = supabaseClient.auth.getUser();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        handleAuthSession(event, session);
        if (event === "SIGNED_IN") { // se o usuário estiver logado:
          const signedInUser = supabaseClient.auth.user(); // pega o usuário logado
          const userId = signedInUser.id; // o id do usuário
          supabaseClient
            .from("profiles")
            .upsert({ id: userId })
            .then((_data, error) => {
              if (!error) {
                router.push("/");
              }
            });
        }
        if (event === "SIGNED_OUT") {
          router.push("/signin");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (user) {
      if (router.pathname === "/signin") {
        router.push("/");
      }
    }
  }, [router.pathname, user, router]);

  const handleAuthSession = async (event, session) => {
    await fetch("/api/auth"),
      {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ event, session }),
      };
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
