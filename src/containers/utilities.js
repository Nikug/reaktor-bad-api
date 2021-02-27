import {
    API_AVAILABILITY,
    API_PRODUCTS,
    ERROR_TYPE,
    RETRY_FETCHES,
    XML_TAGS,
} from "../consts/Api";

let cache = {};

export const clearCache = () => {
    cache = {};
};

export const fetchProducts = async (productType) => {
    try {
        console.log("Fetching", productType);
        const response = await fetch(`${API_PRODUCTS}${productType}`);
        const products = await response.json();
        const categorizedProducts = processProducts(products);
        console.log("Total products for", productType, products.length);
        const availabilities = await getAvailability(
            Object.keys(categorizedProducts)
        );
        console.log("Got availability", availabilities);

        const fullData = combineData(categorizedProducts, availabilities);
        console.log("Fulldata for", productType, fullData);
        return fullData;
    } catch (error) {
        console.log("Received error", error);
    }
};

const combineData = (productData, availabilityData) => {
    const productKeys = Object.keys(productData);
    const availabilityKeys = Object.keys(availabilityData);

    console.log("Keys", productKeys, availabilityKeys);

    const combinedData = availabilityKeys.reduce(
        (combinedData, manufacturer) => {
            if (productKeys.includes(manufacturer)) {
                const processedData = combineProductsAndAvailability(
                    productData[manufacturer],
                    availabilityData[manufacturer]
                );
                combinedData[manufacturer] = processedData;
            }
            return combinedData;
        },
        {}
    );

    return combinedData;
};

export const getAvailability = async (manufacturers) => {
    const data = await Promise.all(
        manufacturers.map(async (manufacturer) => {
            let json = cache[manufacturer];
            if (json === undefined) {
                for (let i = 0; i < RETRY_FETCHES; i++) {
                    const data = await fetch(
                        `${API_AVAILABILITY}${manufacturer}`
                    );
                    json = await data.json();

                    if (json.response !== "[]") {
                        break;
                    }
                }

                cache[manufacturer] = json;
            }

            const processedData = processAvailability(json.response);
            return { manufacturer: manufacturer, data: processedData };
        })
    );

    const categorizedData = data.reduce(
        (collection, availability) => ({
            ...collection,
            [availability.manufacturer]: availability.data,
        }),
        {}
    );
    return categorizedData;

    // const availabilityData = {};
    // for (let i = 0, limit = manufacturers.length; i < limit; i++) {
    //     let json = cache[manufacturers[i]];
    //     if (json === undefined) {
    //         const data = await fetch(`${API_AVAILABILITY}${manufacturers[i]}`);
    //         json = await data.json();

    //         console.log("Response json", json);

    //         if (json.response === "[]") {
    //             console.log("Refetching data due to error");
    //             i -= 1;
    //             continue;
    //         }

    //         cache[manufacturers[i]] = json;
    //     }

    //     const processedData = processAvailability(json.response);
    //     availabilityData[manufacturers[i]] = processedData;
    // }
    // return availabilityData;
};

export const combineProductsAndAvailability = (products, availabilities) => {
    // TODO: optimize by reducing availabilities size on every found id
    return products.map((product) => {
        const item = availabilities.find(
            (availability) => availability.id === product.id
        );
        return { ...product, availability: item?.availability ?? ERROR_TYPE };
    });
};

export const processAvailability = (items) => {
    if (Array.isArray(items)) {
        return items.map((item) => {
            const id = item.id.toLowerCase();
            const availability = processXML(item.DATAPAYLOAD);
            return { id: id, availability: availability };
        });
    }
    return [];
};

export const processProducts = (items) => {
    if (Array.isArray(items)) {
        return items.reduce((collection, item) => {
            if (collection[item.manufacturer]) {
                collection[item.manufacturer] = [
                    ...collection[item.manufacturer],
                    item,
                ];
            } else {
                collection[item.manufacturer] = [item];
            }
            return collection;
        }, {});
    }
    return [];
};

export const processXML = (xml) => {
    return xml.substring(
        xml.indexOf(XML_TAGS.startTag) + XML_TAGS.startTagLength,
        xml.indexOf(XML_TAGS.endTag)
    );
};

export const createFullList = (combinedData) => {
    if (combinedData === undefined) return [];
    return Object.values(combinedData).flat(1);
};

export const categorizedProductsLength = (categorizedProducts) => {
    return Object.values(categorizedProducts).reduce(
        (count, products) => count + products.length,
        0
    );
};
