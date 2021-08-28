import * as React from "react";
import '../styles/globals.css'
import PlaidConfigProvider from "../context/plaidConfigSettingsProvider";


function MyApp({ Component, pageProps }) {
  return (
      <PlaidConfigProvider>
        <Component {...pageProps} />
      </PlaidConfigProvider>
  );
}

export default MyApp;
