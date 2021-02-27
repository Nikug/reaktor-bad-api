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
        const response = await fetch(`${API_PRODUCTS}${productType}`);
        const products = await response.json();
        const categorizedProducts = processProducts(products);
        const availabilities = await getAvailability(
            Object.keys(categorizedProducts)
        );

        const fullData = combineData(categorizedProducts, availabilities);
        return fullData;
    } catch (error) {
        console.log("Received error", error);
    }
};

const combineData = (productData, availabilityData) => {
    const productKeys = Object.keys(productData);
    const availabilityKeys = Object.keys(availabilityData);

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
};

export const combineProductsAndAvailability = (products, availabilities) => {
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
