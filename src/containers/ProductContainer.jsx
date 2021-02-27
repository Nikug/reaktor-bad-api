import { PRODUCTS, REFRESH_DELAY } from "../consts/Api";
import React, { useEffect, useMemo, useState } from "react";
import { clearCache, createFullList, fetchProducts } from "./utilities";

import { Main } from "../views/Main";

// On start, get all data, simply everything and store it
// On category select just display the wanted items
// Update cache every ~5 minutes
// Also add manual update button

// In case availability data is missing, refetch that data after a delay

export const ProductContainer = () => {
    const [fullData, setFullData] = useState({});
    const [productCategory, setProductCategory] = useState(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEverything();
        setInterval(() => {
            clearCache();
            fetchEverything();
        }, REFRESH_DELAY);
    }, []);

    const fetchEverything = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    useEffect(() => {
        console.log("Full data by category", fullData[productCategory]);
    }, [fullData, productCategory]);

    const items = useMemo(() => createFullList(fullData[productCategory]), [
        fullData,
        productCategory,
    ]);

    return (
        <Main
            products={items ?? []}
            totalCount={items?.length ?? 0}
            category={productCategory}
            loading={loading}
            showProduct={setProductCategory}
        />
    );
};
