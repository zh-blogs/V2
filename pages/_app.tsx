import "@/styles/globals.css";

import React from 'react';
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import Head from "next/head";
import Layout from "@/components/layout";
import { Context, defaultContext } from "@/utils";

function MyApp({ Component, pageProps }: AppProps) {
  const [ctx, setCtx] = React.useState(defaultContext);
  React.useEffect(() => {
    setCtx((ctx) => ({
      ...ctx,
      setContext: (newCtx) => {
        setCtx((oldCtx) => ({
          ...oldCtx,
          ...newCtx,
        }));
      }
    })); 
  }, [setCtx]);
  
  return (
    <div className="root">
      <Context.Provider value={ctx}>
        <Head>
          <title>中文博客列表导航-尝试链接几乎所有的中文博客</title>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Context.Provider>
    </div>
  );
}

export default MyApp;
