// read env vars from .env file
import 'dotenv/config';
import util from 'util';
import express from 'express';
import bodyParser from 'body-parser';
import moment from 'moment';
import plaid, {ClientOptions, CreateLinkTokenOptions} from 'plaid';

const APP_PORT = process.env.APP_PORT || 8000;
const PLAID_CLIENT_ID: string = process.env.PLAID_CLIENT_ID as string;
const PLAID_SECRET = process.env.PLAID_SECRET as string;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(
  ',',
);

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:8000/oauth-response.html'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// Parameter used for OAuth in Android. This should be the package name of your app,
// e.g. com.plaid.linksample
// const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN: any = null;
let PUBLIC_TOKEN: any = null;
let ITEM_ID: any = null;
// The payment_id is only relevant for the UK Payment Initiation product.
// We store the payment_id in memory - in production, store it in a secure
// persistent data store
let PAYMENT_ID: any = null;

// Initialize the Plaid client
// Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)
const clientOptions: ClientOptions = { version: '2019-05-29' };

const clientConfig = {
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments[PLAID_ENV],
  options: clientOptions
};
const client = new plaid.Client( clientConfig );

const app = express();
app.use(express.static('public'));
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());


// ts-ignore
app.get('/', ( _: any, response: any, next: any) => {
  response.sendFile('./views/index.html', { root: __dirname });
});

// This is an endpoint defined for the OAuth flow to redirect to.
app.get('/oauth-response.html', ( _: any, response: any, next: any) => {
  response.sendFile('./views/oauth-response.html', { root: __dirname });
});

app.post('/api/info', ( _: any, response: any, next: any) => {
  response.json({
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products: PLAID_PRODUCTS,
  });
});

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#create-link-token
app.post('/api/create_link_token', ( _: any, response: any, next: any) => {
  const configs: CreateLinkTokenOptions = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: 'user-id',
    },
    client_name: 'Plaid Quickstart',
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: 'en',
  };

  if (PLAID_REDIRECT_URI !== '') {
    configs.redirect_uri = PLAID_REDIRECT_URI;
  }

  /*
  if (PLAID_ANDROID_PACKAGE_NAME !== '') {
    configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
  }
  */

  client.createLinkToken(configs,  (error: any, createTokenResponse: any) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    response.json(createTokenResponse);
  });
});

// Create a link token with configs which we can then use to initialize Plaid Link client-side.
// See https://plaid.com/docs/#payment-initiation-create-link-token-request
app.post('/api/create_link_token_for_payment',  (_: any, response: any, next: any ) => {
  client.createPaymentRecipient(
    'Harry Potter',
    'GB33BUKB20201555555555',
    {
      street: ['4 Privet Drive'],
      city: 'Little Whinging',
      postal_code: '11111',
      country: 'GB',
    },
     (recipientResponseError: any, createRecipientResponse: any) => {
       if (recipientResponseError != null) {
         prettyPrintResponse(recipientResponseError);
         return response.json({ recipientResponseError });
       }
       const {recipient_id} = createRecipientResponse;

        client.createPayment(
            recipient_id,
          'payment_ref',
          {
            value: 12.34,
            currency: 'GBP',
          },
            (paymentResponseError: any, createPaymentResponse: any) => {
              if (paymentResponseError != null) {
                prettyPrintResponse(paymentResponseError);
                return response.json({
                  paymentResponseError,
                });
              }
              prettyPrintResponse(createPaymentResponse);
              const {payment_id} = createPaymentResponse;
              PAYMENT_ID = payment_id;
              const configs: CreateLinkTokenOptions = {
                user: {
                  // This should correspond to a unique id for the current user.
                  client_user_id: 'user-id',
                },
                client_name: 'Plaid Quickstart',
                products: PLAID_PRODUCTS,
                country_codes: PLAID_COUNTRY_CODES,
                language: 'en',
                payment_initiation: {
                  payment_id,
                },
              };
              if (PLAID_REDIRECT_URI !== '') {
                configs.redirect_uri = PLAID_REDIRECT_URI;
              }
              client.createLinkToken(
                {
                  user: {
                    // This should correspond to a unique id for the current user.
                    client_user_id: 'user-id',
                  },
                  client_name: 'Plaid Quickstart',
                  products: PLAID_PRODUCTS,
                  country_codes: PLAID_COUNTRY_CODES,
                  language: 'en',
                  redirect_uri: PLAID_REDIRECT_URI,
                  payment_initiation: {
                    payment_id
                  },
                },
                  (tokenResponseError: any, createTokenResponse: any) => {
                    if (tokenResponseError != null) {
                      prettyPrintResponse(tokenResponseError);
                      return response.json({
                        tokenResponseError,
                      });
                    }
                    response.json(createTokenResponse);
                });
          });
      });
});

// Exchange token flow - exchange a Link public_token for
// an API access_token
// https://plaid.com/docs/#exchange-token-flow
app.post('/api/set_access_token',  (request: any, response: any) => {
  PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN,  (error, tokenResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    prettyPrintResponse(tokenResponse);
    response.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    });
  });
});

// Retrieve an Item's accounts
// https://plaid.com/docs/#accounts
app.get('/api/accounts',  (_: any, response: any) => {
  client.getAccounts(ACCESS_TOKEN,  (error: any, accountsResponse: any) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(accountsResponse);
    response.json(accountsResponse);
  });
});

// Retrieve ACH or ETF Auth data for an Item's accounts
// https://plaid.com/docs/#auth
app.get('/api/auth',  (_: any, response: any) => {
  client.getAuth(ACCESS_TOKEN,  (error: any, authResponse: any) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(authResponse);
    response.json(authResponse);
  });
});

// Retrieve Transactions for an Item
// https://plaid.com/docs/#transactions
app.get('/api/transactions',  (_: any, response: any, next: any) => {
  // Pull transactions for the Item for the last 30 days
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  client.getTransactions(
    ACCESS_TOKEN,
    startDate,
    endDate,
    {
      count: 250,
      offset: 0,
    },
     (error: any, transactionsResponse: any) => {
      if (error != null) {
        prettyPrintResponse(error);
        return response.json({
          error,
        });
      } else {
        prettyPrintResponse(transactionsResponse);
        response.json(transactionsResponse);
      }
    },
  );
});

// Retrieve Identity for an Item
// https://plaid.com/docs/#identity
app.get('/api/identity',  (_ : any, response: any, next: any) => {
  client.getIdentity(ACCESS_TOKEN,  (error: any, identityResponse: any) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(identityResponse);
    response.json({ identity: identityResponse.accounts });
  });
});

// Retrieve real-time Balances for each of an Item's accounts
// https://plaid.com/docs/#balance
app.get('/api/balance',  (_: any, response: any, next: any) => {
  client.getBalance(ACCESS_TOKEN, (error: any, balanceResponse: any) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(balanceResponse);
    response.json(balanceResponse);
  });
});

// Retrieve Holdings for an Item
// https://plaid.com/docs/#investments
app.get('/api/holdings', (_: any, response: any) => {
  client.getHoldings(ACCESS_TOKEN,  (error: any, holdingsResponse: any) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    prettyPrintResponse(holdingsResponse);
    response.json({ error: null, holdings: holdingsResponse });
  });
});

// Retrieve Investment Transactions for an Item
// https://plaid.com/docs/#investments
app.get('/api/investment_transactions', (_: any, response: any) => {
  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  client.getInvestmentTransactions(ACCESS_TOKEN, startDate, endDate)
      .then((investmentTransactionsResponse: any) => {
        prettyPrintResponse(investmentTransactionsResponse);
        response.json({ error: null, investment_transactions: investmentTransactionsResponse });
      })
      .catch((err: any) => {
        if (err != null) {
          prettyPrintResponse(err);
          return response.json({ err });
        }
      });
});

// Create and then retrieve an Asset Report for one or more Items. Note that an
// Asset Report can contain up to 100 items, but for simplicity we're only
// including one Item here.
// https://plaid.com/docs/#assets
app.get('/api/assets', (_, response: any) => {
  // You can specify up to two years of transaction history for an Asset
  // Report.
  const daysRequested = 10;

  // The `options` object allows you to specify a webhook for Asset Report
  // generation, as well as information that you want included in the Asset
  // Report. All fields are optional.
  const options = {
    client_report_id: 'Custom Report ID #123',
    // webhook: 'https://your-domain.tld/plaid-webhook',
    user: {
      client_user_id: 'Custom User ID #456',
      first_name: 'Alice',
      middle_name: 'Bobcat',
      last_name: 'Cranberry',
      ssn: '123-45-6789',
      phone_number: '555-123-4567',
      email: 'alice@example.com',
    },
  };
  client.createAssetReport([ACCESS_TOKEN], daysRequested, options)
      .then((assetReportCreateResponse: any) => {
        prettyPrintResponse(assetReportCreateResponse);
        const assetReportToken = assetReportCreateResponse.asset_report_token;
        respondWithAssetReport(20, assetReportToken, client, response);
      })
      .catch((error: any) => {
        if (error != null) {
          prettyPrintResponse(error);
          return response.json({ error });
        }
      })
});

// This functionality is only relevant for the UK Payment Initiation product.
// Retrieve Payment for a specified Payment ID
app.get('/api/payment',  (_: any, response: any) => {
  client.getPayment(PAYMENT_ID)
      .then(( paymentGetResponse:any) => {
        prettyPrintResponse(paymentGetResponse);
        response.json({ error: null, payment: paymentGetResponse });
      })
      .catch(( error: any ) => {
        if (error != null) {
          prettyPrintResponse(error);
          return response.json({ error });
        }
      });
});

// Retrieve information about an Item
// https://plaid.com/docs/#retrieve-item
app.get('/api/item',  (_: any, response: any) => {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  client.getItem(ACCESS_TOKEN,  (error, itemResponse) => {
    if (error != null) {
      prettyPrintResponse(error);
      return response.json({
        error,
      });
    }
    // Also pull information about the institution
    client.getInstitutionById(itemResponse.item.institution_id, (err: any, instRes: any ) => {
      if (err != null) {
        const msg =
          'Unable to pull institution information from the Plaid API.';
        console.log(msg + '\n' + JSON.stringify(error));
        return response.json({
          error: msg,
        });
      } else {
        prettyPrintResponse(itemResponse);
        response.json({
          item: itemResponse.item,
          institution: instRes.institution,
        });
      }
    });
  });
});

const server = app.listen(APP_PORT, () => {
  console.log('plaid-quickstart server listening on port ' + APP_PORT);
});

const prettyPrintResponse = (response : any) => {
  console.log(util.inspect(response, { colors: true, depth: 4 }));
};

// This is a helper function to poll for the completion of an Asset Report and
// then send it in the response to the client. Alternatively, you can provide a
// webhook in the `options` object in your `/asset_report/create` request to be
// notified when the Asset Report is finished being generated.
const respondWithAssetReport = ( numRetriesRemaining: any, assetReportToken: any, clientObj: any, response: any ) => {
  if (numRetriesRemaining === 0) {
    return response.json({
      error: 'Timed out when polling for Asset Report',
    });
  }

  const includeInsights = false;
  clientObj.getAssetReport(assetReportToken, includeInsights, (error: any, assetReportGetResponse: any ) => {
    if (error != null) {
      prettyPrintResponse(error);
      if (error.error_code === 'PRODUCT_NOT_READY') {
        setTimeout(() => respondWithAssetReport( --numRetriesRemaining, assetReportToken, clientObj, response),
          1000,
        );
        return;
      }

      return response.json({
        error,
      });
    }

    clientObj.getAssetReportPdf(assetReportToken, (err: any, assetReportGetPdfResponse: any) => {
      if (err != null) {
        return response.json({
          err,
        });
      }

      response.json({
        error: null,
        json: assetReportGetResponse.report,
        pdf: assetReportGetPdfResponse.buffer.toString('base64'),
      });
    });
  });
};

export default server;
