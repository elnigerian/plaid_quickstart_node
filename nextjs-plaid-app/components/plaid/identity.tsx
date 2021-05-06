import * as React from "react";

const Identity = () => {
    return (
        <div className="">
            <div className="">
                <div className="">post</div>
            </div>
            <div className="">
                <div className="">Identity</div>
                <div className="">/identity/get</div>
                <p className="">
                    Retrieve Identity information on file with the bank. Reduce
                    fraud by comparing user-submitted data to validate identity.
                </p>
            </div>
            <div className="">
                <button id="btnIdentity" className="">
                    Send request
                </button>
            </div>
            <div className="">
                <table>
                    <tbody id="get-identity-data"></tbody>
                </table>
            </div>
        </div>
    );
}

export default Identity;
