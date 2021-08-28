import * as React from "react";
import {usePlaidConfigSettings} from "../../context";


type ExchangeLinkTokenProps = {
    link_token ?: any;
    publicToken ?: any;
    metaData ?: any;
    accessToken ?: any;
    itemID ?: any;
    institutionID ?: any;
    options ?: any;
    updatePublicToken ?: any;
    updateAccessToken ?: any;
    updateItemID ?: any;
}

/**
 * Exchanging the link token for a temp public token before requesting and
 * creating the asset token.
 *
 * Note that the call is made to the sandbox public token create api and that
 * means that this will not translate to production.
 *
 * @component
 */
const ExchangeLinkToken: React.FunctionComponent<ExchangeLinkTokenProps> = () => {
    const {linkToken, metaData, setPlaidConfigSettings} = usePlaidConfigSettings();
    const {publicToken} = metaData;
    React.useEffect(() => {
        fetch('http://localhost:4000/api/exchange_public_token', {
            method: 'POST',
            headers: {
                "Content_Type": "application/json"
            },
            body: JSON.stringify({public_token: publicToken})
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                const {access_token, item_id} = json;
                setPlaidConfigSettings({linkToken, metaData, accessToken: access_token, itemID: item_id})
            })
    }, []);
    return (
        <>
            <p>This is the metaData {JSON.stringify(metaData, null, 2)}</p>
        </>
    );
}

export default ExchangeLinkToken;
