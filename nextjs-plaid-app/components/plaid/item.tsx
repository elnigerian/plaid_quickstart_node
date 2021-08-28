import * as React from 'react';

const ItemManagement = () => {
    return (
        <div className="box">
            <h3 className="box__heading">Item management</h3>

            <div className="item-data-row">
                <div className="item-data-row__left">
                    <div className="item-data-row__request-type">post</div>
                </div>
                <div className="item-data-row__center">
                    <div className="item-data-row__endpoint">/item/get</div>
                    <div className="item-data-row__description">
                        Retrieve information about an Item, like the institution,
                        billed products, available products, and webhook
                        information.
                    </div>
                </div>

                <div className="item-data-row__right">
                    <button
                        id="get-item-btn"
                        className="button button--is-small button--is-default button--is-full-width"
                    >
                        Send request
                    </button>
                </div>

                <div className="item-data-row__response">
                    <table>
                        <tbody id="get-item-data"></tbody>
                    </table>
                </div>
            </div>

            <div className="item-data-row">
                <div className="item-data-row__left">
                    <div className="item-data-row__request-type">post</div>
                </div>
                <div className="item-data-row__center">
                    <div className="item-data-row__endpoint">/accounts/get</div>
                    <div className="item-data-row__description">
                        Retrieve high-level information about all accounts
                        associated with an Item.
                    </div>
                </div>

                <div className="item-data-row__right">
                    <button
                        id="get-accounts-btn"
                        className="button button--is-small button--is-default button--is-full-width"
                    >
                        Send request
                    </button>
                </div>

                <div className="item-data-row__response">
                    <table>
                        <tbody id="get-accounts-data"></tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ItemManagement;
