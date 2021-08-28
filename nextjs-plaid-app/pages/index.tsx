import * as React from "react";
import styles from '../styles/Home.module.css';
import Layout from "../components/layout";
import Institutions from "../components/plaid/institutions";
import Link from "../components/plaid/link";
import {usePlaidConfigSettings} from "../context";
import ExchangeLinkToken from "../components/plaid/exchangeLinkToken";
import {useCallback} from "react";

const Home = () => {
        const [linkToken, setLinkToken] = React.useState<any>(null);
        const [institutionID, setInstitutionID] = React.useState<any>(null);
        const [publicToken, setPublicToken] = React.useState<any>(null);
        const [accessToken, setAccessToken] = React.useState<any>(null);
        const [metaData, setMetaData] = React.useState<any>(null);
        const [itemID, setItemID] = React.useState<any>(null);
        const {setPlaidConfigSettings} = usePlaidConfigSettings();

        React.useEffect(() => {
            fetch('http://localhost:4000/api/create_link_token', {
                method: 'POST',
            }).then((res) => res.json()).then((json) => {
                console.log(json);
                setLinkToken(json);
                setPlaidConfigSettings({linkToken: json})
            })
        }, []);

        const onInstitutionSelected = useCallback( (e: any) => {
            e.stopPropagation();
            e.preventDefault();
            console.log(e.target.value)
            setInstitutionID(e.target.value);
        }, [setInstitutionID]);

        return (
            <Layout>
                <div className={styles.grid}>
                    <p id="intro" className="">
                        An example application that outlines an end-to-end integration
                        with Plaid
                    </p>
                </div>
                <p>Note: This works only in dhe default Sandbox environment</p>
                <p>Link token generated: <span className={styles.code}>{linkToken}</span></p>
                <div className={styles.spaceBar}>
                    <Institutions institutionSelected={onInstitutionSelected}/>
                </div>
                <div className={styles.spaceBar}>
                    {
                        linkToken && linkToken !== '' && institutionID && institutionID !== '' &&
                        <Link linkToken={linkToken} key={linkToken}/>
                    }
                </div>
                <div className={styles.spaceBar}>
                    {
                        // linkToken && linkToken !== '' && publicToken && publicToken !== '' &&
                        // <ExchangeLinkToken publicToken={publicToken}
                        //                    metaData={metaData}
                        //                    accessToken={accessToken}
                        //                    itemID={itemID}
                        //                    key={publicToken}
                        //                    updateItemID={setItemID}
                        //                    updateAccessToken={setAccessToken}/>
                    }
                </div>
            </Layout>
        );
}


export default Home;
