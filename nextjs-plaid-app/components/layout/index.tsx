import * as React from "react";
import styles from "../../styles/Home.module.css";
import Header from "./header";
import Footer from "./footer";

type LayoutProps = {
    children?: any;
    options ?: any;
}

const Layout: React.FunctionComponent<LayoutProps>= ({children}) => {

    return (
        <div className={styles.container}>
            <Header />

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <a href="https://plaid.com">Plaid </a>Quickstart Example!
                </h1>
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default Layout;
