import Head from "next/head";
import { APP_NAME } from "./../config";

//head section for SEO --call it as a function not component
export const HeadSEO = (name) => (
  <Head>
    <title>
      {name} | {APP_NAME}
    </title>
  </Head>
);
