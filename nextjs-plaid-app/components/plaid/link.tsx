import * as React from 'react';
import {usePlaidLink} from "react-plaid-link";
import {usePlaidConfigSettings} from "../../context";
import item from "./item";
import {useExchangePublicToken} from "../../hooks";

interface LinkProps {
    linkToken: string | null;
    updatePublicToken ?: any;
    updateMetaData ?: any;
    updateAccessToken ?: any;
    updateItemID ?: any;
}

const Link: React.FC<LinkProps> = ({linkToken}: LinkProps) => {
    const {setPlaidConfigSettings} = usePlaidConfigSettings();

    const onSuccess = React.useCallback( (public_token, metadata) => {
        // send public_token to server
        const setTokenValues: any = async () => {
            const response = await fetch('http://localhost:4000/api/exchange_public_token', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(public_token),
            });
            const data = await response.json();
            console.log('json response from call to exchange public token ', JSON.stringify(data, null, 2))
            return data
        };
        // setTokenValues();
        const {access_token, item_id} = setTokenValues();
        console.log('access_token ', access_token)
        console.log('item_id ', item_id)
        setPlaidConfigSettings({linkToken, accessToken: access_token, itemID: item_id, metaData: metadata})
    }, [setPlaidConfigSettings]);
    const config: Parameters<typeof usePlaidLink>[0] = {
        token: linkToken!,
        onSuccess,
    };
    const { open, ready } = usePlaidLink(config);
    return (
        <button onClick={() => open()} disabled={!ready}>
            Link account
        </button>
    );
};

export default Link;
