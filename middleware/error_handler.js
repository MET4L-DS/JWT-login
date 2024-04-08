const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
	// if (err instanceof CustomAPIError) {
	// 	res.status(err.statusCode).json({ msg: err.message });
	// 	return;
	// }
	const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
	const errMessage = err.message || "Something went wrong.";
	res.status(statusCode).json({ msg: errMessage });
};

module.exports = { errorHandlerMiddleware };
