import { PRODUCTS, REFRESH_DELAY } from "../consts/Api";
import React, { useEffect, useMemo, useState } from "react";
import { clearCache, createFullList, fetchProducts } from "./utilities";

import { Main } from "../views/Main";

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

        let data = {};
        for (let i = 0, limit = categories.length; i < limit; i++) {
            const products = await fetchProducts(categories[i]);
            data[categories[i]] = products;
        }

        setFullData(data);
        setLoading(false);
    };

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
