import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />


        <div
          className="zalo-chat-widget hidden " 
          data-oaid="2009180325727970604"
          data-welcome-message="Xin chào! Rất vui khi được hỗ trợ bạn."
          data-autopopup="0"
          data-width="350"
          data-height="450"
          />
        <Script
          id="zaloChat"
          strategy="lazyOnload"
          src="https://sp.zalo.me/plugins/sdk.js"
        />  

        <NextScript />
      </body>
    </Html>

  );
}
