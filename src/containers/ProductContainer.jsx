import { API_PRODUCTS, API_URL } from "../consts/Api";

import { Main } from "../views/Main";
import React from "react";

const products = [
    {
        id: 1,
        name: "some item",
        availability: "available",
    },
    {
        id: 2,
        name: "some item 2",
        availability: "not available",
    },
    {
        id: 3,
        name: "some item 3",
        availability: "less than 3",
    },
    {
        id: 4,
        name: "some item 4",
        availability: "in stock",
    },
    {
        id: 5,
        name: "some item 5",
        availability: "available",
    },
];

export const ProductContainer = () => {
    const showProduct = async (productType) => {
        try {
            const response = await fetch(
                `${API_URL}${API_PRODUCTS}${productType}`
            );
            const data = await response.json();
            console.log("Received data", data);
        } catch (error) {
            console.log("Received error", error);
        }
    };

    return <Main products={products} showProduct={showProduct} />;
};
