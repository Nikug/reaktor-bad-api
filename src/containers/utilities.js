import { ERROR_TYPE, XML_TAGS } from "../consts/Api";

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
    return Object.values(combinedData).flat(1);
};

export const categorizedProductsLength = (categorizedProducts) => {
    return Object.values(categorizedProducts).reduce(
        (count, products) => count + products.length,
        0
    );
};
