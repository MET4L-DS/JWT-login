const express = require("express");

const authRouter = require("./routes/auth");

const { errorHandlerMiddleware } = require("./middleware/error_handler");

const app = express();

app.use(express.json());

app.use("/", authRouter);

app.use(errorHandlerMiddleware);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
