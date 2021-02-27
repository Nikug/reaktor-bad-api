import { Header } from "../components/Header";
import { Products } from "../components/Products";
import React from "react";

export const Main = ({
    products,
    showProduct,
    totalCount,
    category,
    loading,
    refreshData,
}) => {
    return (
        <>
            <Header
                showProduct={showProduct}
                refreshData={refreshData}
                loading={loading}
            />
            {loading && <p>Loading data... This can take up to a minute</p>}
            <Products
                products={products}
                totalCount={totalCount}
                category={category}
            />
        </>
    );
};
