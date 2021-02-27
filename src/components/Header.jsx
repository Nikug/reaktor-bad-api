import "./Header.scss";

import { PRODUCTS } from "../consts/Api";
import React from "react";

export const Header = ({ showProduct, refreshData, loading }) => {
    return (
        <div className={"header"}>
            <button onClick={() => showProduct(PRODUCTS.beanie)}>
                Beanies
            </button>
            <button onClick={() => showProduct(PRODUCTS.facemask)}>
                Facemasks
            </button>
            <button onClick={() => showProduct(PRODUCTS.gloves)}>Gloves</button>
            <button disabled={loading} onClick={() => refreshData()}>
                Refresh data
            </button>
        </div>
    );
};
