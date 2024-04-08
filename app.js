const express = require("express");

const mainRouter = require("./routes/main");

const { errorHandlerMiddleware } = require("./middleware/error_handler");

const app = express();

app.use(express.json());

app.get("/", mainRouter);

app.use(errorHandlerMiddleware);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
