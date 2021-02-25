import { API_AVAILABILITY, API_PRODUCTS } from "../consts/Api";
import React, { useEffect, useState } from "react";
import {
    categorizedProductsLength,
    combineProductsAndAvailability,
    createFullList,
    processAvailability,
    processProducts,
} from "./utilities";

import { Main } from "../views/Main";

const products = [
    {
        id: 1,
        name: "some item",
        availability: "available",
    },
];

export const ProductContainer = () => {
    const [availabilityData, setAvailabilityData] = useState({});
    const [productData, setProductData] = useState({});
    const [combinedData, setCombinedData] = useState({});

    useEffect(() => {
        const productKeys = Object.keys(productData);
        const availabilityKeys = Object.keys(availabilityData);
        const combinedKeys = Object.keys(combinedData);

        availabilityKeys.map((manufacturer) => {
            if (
                productKeys.includes(manufacturer) &&
                !combinedKeys.includes(manufacturer)
            ) {
                const processedData = combineProductsAndAvailability(
                    productData[manufacturer],
                    availabilityData[manufacturer]
                );
                setCombinedData((previous) => ({
                    ...previous,
                    [manufacturer]: processedData,
                }));
            }
        });
    }, [availabilityData, productData, combinedData]);

    useEffect(() => {
        console.log("full data", combinedData);
    });

    const showProduct = async (productType) => {
        try {
            setCombinedData({});
            const response = await fetch(`${API_PRODUCTS}${productType}`);
            const products = await response.json();
            const categorizedProducts = processProducts(products);
            setProductData(categorizedProducts);
            getAvailability(Object.keys(categorizedProducts));
        } catch (error) {
            console.log("Received error", error);
        }
    };

    const getAvailability = async (manufacturers) => {
        manufacturers.map((manufacturer) =>
            fetch(`${API_AVAILABILITY}${manufacturer}`)
                .then((data) => data.json())
                .then((data) => {
                    const items = processAvailability(data.response);
                    setAvailabilityData((previous) => ({
                        ...previous,
                        [manufacturer]: items,
                    }));
                })
        );
    };

    return (
        <Main
            products={createFullList(combinedData)}
            totalCount={categorizedProductsLength(productData)}
            showProduct={showProduct}
        />
    );
};
