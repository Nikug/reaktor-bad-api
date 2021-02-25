import { Header } from "../components/Header";
import { Products } from "../components/Products";
import React from "react";

export const Main = ({ products, showProduct }) => {
    return (
        <>
            <Header showProduct={showProduct} />
            <Products products={products} />
        </>
    );
};
