import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
    Configuration,
    CountryCode,
    InstitutionsGetRequest, ItemPublicTokenExchangeRequest,
    PlaidApi,
    PlaidEnvironments, Products,
    SandboxPublicTokenCreateRequest
} from 'plaid';

const NODE_ENV = process.env.NODE_ENV;
const APP_PORT = process.env.APP_PORT || 4000;
const PLAID_CLIENT_ID: string = process.env.PLAID_CLIENT_ID as string;
const PLAID_SECRET = process.env.PLAID_SECRET as string;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN: any = null;
let PUBLIC_TOKEN: any = null;
let ITEM_ID: any = null;


const whitelist = process.env.NODE_ENV === 'production' ?
    ['https://prelaunch.hoams.co', 'http://prelaunch.hoams.co',]
    : ['http://localhost:3000', 'http://localhost:4000'];

const corsOptionsDelegate = (req: any, callback: any) => {
    const corsOptions = whitelist.indexOf(req.headers.origin) >= 0 ?
        {
            origin: whitelist[whitelist.indexOf(req.headers.origin)],
            credentials: true,
            // allowedHeaders: ['Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'],
        } : { credentials: false };
    callback(null, corsOptions); // callback expects two parameters: error and options

};

const app = express();
app.use(cors(corsOptionsDelegate));

app.use(express.json());

const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
            'Plaid-Version': '2020-09-14',
        },
    },
});

const client = new PlaidApi(configuration);

/**
 *
 */
app.get('/api/info', ( _: any, response: any, next: any) => {
    response.status('200');
    response.json({
        item_id: ITEM_ID,
        access_token: ACCESS_TOKEN,
        products: PLAID_PRODUCTS,
    });
});

/**
 *
 */
app.post('/api/create_link_token', async (_, response) => {
    // Get the client_user_id by searching for the current user
    const user = {id: "••••••••hsakjsl", username: "user_good", password: "pass_good"};
    const clientUserId = user.id;
    const request: any = {
        user: {
            // This should correspond to a unique id for the current user.
            client_user_id: clientUserId,
        },
        client_name: 'Plaid Test App',
        products: PLAID_PRODUCTS,
        language: 'en',
        webhook: 'https://webhook.example.com',
        country_codes: PLAID_COUNTRY_CODES,
    };
    try {
        const createTokenResponse = await client.linkTokenCreate(request);
        const {link_token} = createTokenResponse.data;
        // todo - remove
        console.log('This is the result of the call passed to the client for link_token', link_token);
        response.json(link_token);
    } catch (error) {
        // handle error
    }
});

/**
 *
 */
app.post('/api/sandbox/public_token/create', async (request: any, response: any, next: any) => {
    const institutionID = request.body.institutionID;
    const publicTokenRequest: SandboxPublicTokenCreateRequest = {
        institution_id: institutionID,
        initial_products: PLAID_PRODUCTS as Products[]
    };
    try {
        const publicTokenResponse = await client.sandboxPublicTokenCreate(publicTokenRequest);
        const publicToken = publicTokenResponse.data.public_token;
        // todo - remove
        console.log('This is the result of the call passed to the client for publicToken ', publicToken);
        response.json(publicToken);
        // The generated public_token can now be exchanged
        // for an access_token
        // const exchangeRequest: ItemPublicTokenExchangeRequest = {
        //     public_token: publicToken,
        // };
        // const exchangeTokenResponse = await client.exchangePublicToken(exchangeRequest);
        // const accessToken = exchangeTokenResponse.data.access_token;
    } catch (error) {
        // handle error
    }
    },
);

/**
 *
 */
app.post('/api/item/public_token/create', async (request: any, response: any, next: any) => {
    const institutionID = request.body.institutionID;
    const publicTokenRequest: SandboxPublicTokenCreateRequest = {
        institution_id: institutionID,
        initial_products: PLAID_PRODUCTS as Products[]
    };
    try {
        const publicTokenResponse = await client.sandboxPublicTokenCreate(publicTokenRequest);
        const publicToken = publicTokenResponse.data.public_token;
        // todo - remove
        console.log('This is the result of the call passed to the client for publicToken ', publicToken);
        response.json(publicToken);
        // The generated public_token can now be exchanged
        // for an access_token
        // const exchangeRequest: ItemPublicTokenExchangeRequest = {
        //     public_token: publicToken,
        // };
        // const exchangeTokenResponse = await client.exchangePublicToken(exchangeRequest);
        // const accessToken = exchangeTokenResponse.data.access_token;
    } catch (error) {
        // handle error
    }
    },
);

/**
 *
 */
app.post('/api/exchange_public_token', async (req: any, res: any, next: any) => {
        const publicToken = req.body.public_token;
        console.log('In /api/exchange_public_token ');
        try {
            const response = await client.itemPublicTokenExchange({
                public_token: publicToken,
            });
            const accessToken = response.data.access_token;
            const itemID = response.data.item_id;
            const data = {access_token: accessToken, item_id: itemID}
            res.json(JSON.stringify(data));
            console.log('Result from calling /api/exchange_public_token => ', JSON.stringify(data));
        } catch (error) {
            // handle error
        }
    },
);

app.get('/api/accounts', async (request, response, next) => {
    try {
        const accountsResponse = await client.accountsGet({
            access_token: ACCESS_TOKEN,
        });
        // prettyPrintResponse(accountsResponse);
        response.json(accountsResponse.data);
    } catch (error) {
        // prettyPrintResponse(error);
        // return response.json(formatError(error.response));
        return response.json(error.response);
    }
});

/**
 * Get Institutions
 */
app.get('/api/institutions/get', async (_, res, next) => {
    // Pull institutions
    const request: InstitutionsGetRequest = {
        count: 10,
        offset: 0,
        country_codes: PLAID_COUNTRY_CODES as CountryCode[],
    };
    try {
        const response = await client.institutionsGet(request);
        const institutions = response.data.institutions;
        res.json(institutions);
    } catch (error) {
        // Handle error
        console.log(error)
    }
});


app.listen(APP_PORT, () => {
    console.log(`> Ready on http://localhost:${APP_PORT}`)
})
