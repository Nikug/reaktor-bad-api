import path, { dirname } from "path";

import cors from "cors";
import express from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 4000;

const app = express();

app.use(express.static(path.join(__dirname, "/../build")));

const corsOptions = {
    origin: "https://bad-api-assignment.reaktor.com",
};

app.use(cors(corsOptions));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../build/index.html"));
});

app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
});
