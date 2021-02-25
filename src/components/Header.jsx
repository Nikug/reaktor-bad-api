import { PRODUCTS } from "../consts/Api";
import React from "react";
import styles from "./Header.scss";

export const Header = ({ showProduct }) => {
    return (
        <div className={styles["header"]}>
            <button onClick={() => showProduct(PRODUCTS.beanie)}>
                Beanies
            </button>
            <button onClick={() => showProduct(PRODUCTS.facemask)}>
                Facemasks
            </button>
            <button onClick={() => showProduct(PRODUCTS.gloves)}>Gloves</button>
        </div>
    );
};
