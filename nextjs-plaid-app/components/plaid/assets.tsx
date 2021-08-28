import * as React from "react";

const Assets = () => {
    return (
        <div id="assets" className="" >
            <div className="">
                <div className="">post</div>
            </div>
            <div className="">
                <div className="">Assets</div>
                <div className="">/asset_report/*</div>
                <p className="">Create a point-in-time snapshot of a user's assets.</p>
            </div>

            <div className="item-data-row__right">
                <button
                    id="get-assets-btn"
                    className="button button--is-small button--is-default button--is-full-width"
                >
                    Send request
                </button>

                <a id="download-assets-pdf-btn"
                   className="button button--is-small button--is-primary button--is-full-width">
                    Download as PDF
                </a>
            </div>

            <div className="item-data-row__response">
                <table>
                    <tbody id="get-assets-data"></tbody>
                </table>
            </div>
        </div>
    );
}

export default Assets;
