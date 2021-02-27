import "./Products.scss";

import React from "react";

export const Products = ({ products, totalCount, category }) => {
    const productCount = products.length;
    return (
        <div>
            <h3>
                {!!category
                    ? `${category}: Showing ${productCount}/${totalCount} products`
                    : "Category not selected"}
            </h3>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <span className="item-name">{product.name}</span>
                        <span className="item-info">
                            {product.availability}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
