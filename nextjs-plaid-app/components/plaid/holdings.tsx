import * as React from "react";

const Holdings = () => {
    return (
        <div className="item-data-row">
            <div className="item-data-row__left">
                <div className="item-data-row__request-type">post</div>
            </div>
            <div className="item-data-row__center">
                <div className="item-data-row__nicename">Holdings</div>
                <div className="item-data-row__endpoint">
                    /investments/holdings/get
                </div>
                <div className="item-data-row__description">
                    Retrieve investment holdings on file with the bank,
                    brokerage, or investment institution. Analyze over-exposure
                    to market segments.
                </div>
            </div>
            <div className="item-data-row__right">
                <button
                    id="get-holdings-btn"
                    className="button button--is-small button--is-default button--is-full-width"
                >
                    Send request
                </button>
            </div>
            <div className="item-data-row__response">
                <table>
                    <tbody id="get-holdings-data"></tbody>
                </table>
            </div>
        </div>
    );
}

export default Holdings;
