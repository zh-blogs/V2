import Document, { Html, Head, Main, NextScript } from "next/document";
import db from "@/utils/backend/db";

console.log("NEXT_MANUAL_SIG_HANDLE", process.env.NEXT_MANUAL_SIG_HANDLE);
if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  console.log("handle SIGTERM and SIGINT");
  // this should be added in your custom _document
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM: ', 'cleaning up');
    await db.DB.destroy();
    // sleep 1s to wait for db connection close
    await new Promise((resolve) => setTimeout(resolve, 1000));
    process.exit(0);
  });
  process.on('SIGINT', async () => {
    console.log('Received SIGINT: ', 'cleaning up');
    await db.DB.destroy();
    // sleep 1s to wait for db connection close
    await new Promise((resolve) => setTimeout(resolve, 1000));
    process.exit(0);
  });
}
    
export default class MyDocument extends Document {
  constructor(props:any) {
    super(props);
  }

  render() {
 

    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />

          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta httpEquiv="Cache-Control" content="no-siteapp" />
          <meta httpEquiv="Cache-Control" content="no-transform" />

          <link rel="canonical" href="https://zhblogs.ohyee.cc/" />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/site.webmanifest"></link>

          <script async defer data-website-id="98945d99-b2fe-474a-a76a-a3f25811edac" src="https://u.xiaozonglin.cn/umami.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
