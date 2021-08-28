import * as React from "react";

const Investments = () => {
    return (
        <div className="item-data-row">
            <div className="item-data-row__left">
                <div className="item-data-row__request-type">post</div>
            </div>
            <div className="item-data-row__center">
                <div className="item-data-row__nicename">
                    Investment Transactions
                </div>
                <div className="item-data-row__endpoint">
                    /investments/transactions/get
                </div>
                <div className="item-data-row__description">
                    Retrieve investment transactions to analyze cash flow and
                    trading performance.
                </div>
            </div>
            <div className="item-data-row__right">
                <button
                    id="get-investment-transactions-btn"
                    className="button button--is-small button--is-default button--is-full-width"
                >
                    Send request
                </button>
            </div>
            <div className="item-data-row__response">
                <table>
                    <tbody id="get-investment-transactions-data"></tbody>
                </table>
            </div>
        </div>
    )
}

export default Investments;
