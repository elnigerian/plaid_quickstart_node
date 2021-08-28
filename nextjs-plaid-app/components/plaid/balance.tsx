import * as React from "react";

const Balance = () => {
    return (
        <div className="">
            <div className="">
                <div className="">post</div>
            </div>
            <div className="">
                <div className="">Balance</div>
                <div className="">/accounts/balance/get</div>
                <p className="">Check balances in real time to prevent non-sufficient funds fees.</p>
            </div>
            <div className="">
                <button id="btnBalance" className="button button--is-small button--is-default button--is-full-width">
                    Send request
                </button>
            </div>
            <div className="">
                <table>
                    <tbody id="get-balance-data"></tbody>
                </table>
            </div>
        </div>
    )
}

export default Balance;
