import * as React from 'react';

export type PlaidContextType = {
    linkToken?: string;
    accessToken?: string;
    itemID?: string;
    metaData?: any;
    setPlaidConfigSettings: ({linkToken, accessToken, itemID, metaData}: any) => void;
}

const defaultPlaidConfigContext = {
    linkToken: null,
    accessToken: null,
    itemID: null,
    metaData: {},
    setPlaidConfigSettings: ({linkToken, accessToken, itemID, metaData}: any = {}) => {}
}


export const PlaidConfigContext = React.createContext<PlaidContextType>(defaultPlaidConfigContext);

interface PlaidContextProps {
    children?: any;
}

const PlaidConfigProvider: React.FunctionComponent<PlaidContextProps> = ({children}: any) => {
    const setPlaidConfigSettings = ({linkToken, accessToken, itemID, metaData}: any) => {
        setState({...state, linkToken, accessToken, itemID, metaData});
    };

    const initState = {
        ...defaultPlaidConfigContext,
        setPlaidConfigSettings,
    };
    const [state, setState] = React.useState( initState );

    return (
        <React.Fragment>
            <PlaidConfigContext.Provider value={state}>
                {children}
            </PlaidConfigContext.Provider>
        </React.Fragment>
    );
};

export default PlaidConfigProvider;

export const usePlaidConfigSettings = () => React.useContext(PlaidConfigContext);
