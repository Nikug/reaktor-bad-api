import { API_PRODUCTS, PRODUCTS } from "../consts/Api";
import React, { useEffect, useState } from "react";
import {
    categorizedProductsLength,
    combineProductsAndAvailability,
    createFullList,
    fetchProducts,
} from "./utilities";

import { Main } from "../views/Main";

// On start, get all data, simply everything and store it
// On category select just display the wanted items
// Update cache every ~5 minutes
// Also add manual update button

export const ProductContainer = () => {
    const [fullData, setFullData] = useState({});
    const [productCategory, setProductCategory] = useState(undefined);

    useEffect(() => {
        fetchEverything();
    }, []);

    const fetchEverything = async () => {
        const categories = Object.values(PRODUCTS);
        console.log("Categories", categories);
        const data = await Promise.all(
            categories.map(async (category) => {
                const products = await fetchProducts(category);
                return { category: category, products: products };
            })
        );
        console.log("Full data", data);
        const categorizedData = data.reduce((collection, category) => {
            return {
                ...collection,
                [category.category]: category.products,
            };
        }, {});
        setFullData(categorizedData);
    };

    return (
        <Main
            products={createFullList(fullData[productCategory] ?? [])}
            totalCount={fullData[productCategory]?.length ?? 0}
            showProduct={setProductCategory}
        />
    );
};
