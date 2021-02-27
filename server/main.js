import { API_AVAILABILITY, API_PRODUCTS, API_URL } from "../src/consts/Api.js";
import path, { dirname } from "path";

import express from "express";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 4000;

const app = express();

app.use(express.static(path.join(__dirname, "/../build")));

app.get(`${API_PRODUCTS}:category`, (req, res) => {
    fetch(`${API_URL}${req.path}`).then((response) => {
        response.json().then((value) => res.send(value));
    });
});

app.get(`${API_AVAILABILITY}:manufacturer`, (req, res) => {
    fetch(`${API_URL}${req.path}`).then((response) => {
        response.json().then((value) => res.send(value));
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../build/index.html"));
});

app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
});
