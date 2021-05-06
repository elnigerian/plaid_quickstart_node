import * as React from "react";

const Auth = () => {
    return (
        <div className="">
            <div className="">
                <div className="">post</div>
            </div>
            <div className="">
                <div className="">Auth</div>
                <div className="">/auth/get</div>
                <p className="">Retrieve account and routing numbers for checking and savings accounts.</p>
            </div>
            <div className="">
                <button id="btnAuth" className="">
                    Send request
                </button>
            </div>
            <div className="">
                <table>
                    <tbody id="get-auth-data"></tbody>
                </table>
            </div>
        </div>
    );
}

export default Auth;
