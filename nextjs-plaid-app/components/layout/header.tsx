import * as React from "react";
import Head from "next/head";

const Header = () => {
    return (
        <Head>
            <title>Plaid Next App</title>
            <meta name="description" content="Testing end-to-end plaid integration" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}

export default Header;
