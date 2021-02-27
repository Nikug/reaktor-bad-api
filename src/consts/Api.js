export const API_URL = "https://bad-api-assignment.reaktor.com";
export const API_PRODUCTS = "/v2/products/";
export const API_AVAILABILITY = "/v2/availability/";

export const PRODUCTS = {
    beanie: "beanies",
    gloves: "gloves",
    facemask: "facemasks",
};

export const XML_TAGS = {
    startTag: "<INSTOCKVALUE>",
    endTag: "</INSTOCKVALUE>",
    startTagLength: 14,
};

export const ERROR_TYPE = "ERROR";

export const REFRESH_DELAY = 6 * 60 * 1000; // 6 minutes
export const RETRY_FETCHES = 3;
