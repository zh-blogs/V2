import Document, { Html, Head, Main, NextScript } from "next/document";

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
          <script>
          if (navigator.serviceWorker) {
               navigator.serviceWorker.register('sw.js')
               .then(function(registration) {
                 console.log('已成功注册Service Worker');
               }).catch(function (err) {
                 console.log('Service Wrokrt注册失败');
               })
               }             
          </script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
