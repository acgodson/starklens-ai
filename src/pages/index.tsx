import Head from "next/head";
import { Box } from "@chakra-ui/react";



export default function Home() {
  return (
    <>
      <Head>
        <title>Starklens API</title>
        <meta name="description" content="Starklens API Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box>
         StarkLens API Demo
        </Box>
      </main>
    </>
  );
}
