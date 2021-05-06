import * as React from "react";

const Transactions = () => {
    return (
        <div className="item-data-row">
            <div className="item-data-row__left">
                <div className="item-data-row__request-type">post</div>
            </div>
            <div className="item-data-row__center">
                <div className="item-data-row__nicename">Transactions</div>
                <div className="item-data-row__endpoint">/transactions/get</div>
                <div className="item-data-row__description">
                    Retrieve transactions for credit and depository accounts.
                </div>
            </div>
            <div className="item-data-row__right">
                <button
                    id="get-transactions-btn"
                    className="button button--is-small button--is-default button--is-full-width"
                >
                    Send request
                </button>
            </div>
            <div className="item-data-row__response">
                <table>
                    <tbody id="get-transactions-data"></tbody>
                </table>
            </div>
        </div>
    );
}

export default Transactions;

