import React from "react";

export const Products = ({ products }) => {
    return (
        <div>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <span>{product.name}</span>
                        <span>{product.availability}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
