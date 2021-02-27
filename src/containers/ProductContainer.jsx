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
    const [intervalFunction, setIntervalFunction] = useState();

    useEffect(() => {
        fetchEverything();
        const interval = setInterval(() => {
            clearCache();
            fetchEverything();
        }, REFRESH_DELAY);
        setIntervalFunction(interval);
    }, []);

    const fetchEverything = async () => {
        setLoading(true);
        const categories = Object.values(PRODUCTS);
        console.log("Categories", categories);

        let data = {};
        for (let i = 0, limit = categories.length; i < limit; i++) {
            const products = await fetchProducts(categories[i]);
            data[categories[i]] = products;
        }

        console.log("Full data", data);

        setFullData(data);
        setLoading(false);
    };

    useEffect(() => {
        console.log("Full data by category", fullData[productCategory]);
    }, [fullData, productCategory]);

    const items = useMemo(() => createFullList(fullData[productCategory]), [
        fullData,
        productCategory,
    ]);

    const manualRefresh = async () => {
        clearCache();
        clearInterval(intervalFunction);

        await fetchEverything();

        const interval = setInterval(() => {
            clearCache();
            fetchEverything();
        }, REFRESH_DELAY);
        setIntervalFunction(interval);
    };

    return (
        <Main
            products={items ?? []}
            totalCount={items?.length ?? 0}
            category={productCategory}
            loading={loading}
            showProduct={setProductCategory}
            refreshData={manualRefresh}
        />
    );
};
