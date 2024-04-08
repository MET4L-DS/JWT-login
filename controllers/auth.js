const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const { BadRequestError, CustomAPIError, NotFoundError } = require("../error");

const { asyncFunc } = require("../middleware/async");

const generateAccessToken = (user) => {
	return jwt.sign({ name: user.name }, "jwt_secret_key", {
		expiresIn: "15s",
	});
};

let users = [];
let refreshTokens = [];

const login = asyncFunc(async (req, res, next) => {
	let reqUser = req.body;

	if (!reqUser.name || reqUser.name === "")
		throw new BadRequestError("Username must be provided.");
	// return res.status(500).json({ err: "Username must be provided." });
	if (!reqUser.password || reqUser.password === "")
		throw new BadRequestError("Password must be provided.");
	// return res.status(500).json({ err: "Password must be provided." });

	const storedUser = users.find((user) => user.name === reqUser.name);
	if (!storedUser)
		throw new NotFoundError(
			`User with username: ${reqUser.name} not found.`
		);
	// return res
	// 	.status(500)
	// 	.json({ msg: `User with username: ${reqUser.name} not found.` });

	const result = await bcrypt.compare(reqUser.password, storedUser.password);
	if (!result)
		throw new CustomAPIError(
			"Password does not match.",
			StatusCodes.FORBIDDEN
		);
	// return res.status(500).json({ err: "Password does not match." });

	const accessToken = generateAccessToken(storedUser);
	const refreshToken = jwt.sign(
		{ name: storedUser.name },
		"jwt_refresh_secret"
	);
	refreshTokens.push(refreshToken);

	res.status(StatusCodes.OK).json({
		result: "Successful",
		accessToken: accessToken,
		refreshToken: refreshToken,
	});
});

const register = asyncFunc(async (req, res, next) => {
	let user = req.body;

	if (!user.name || user.name === "")
		throw new BadRequestError("Username must be provided.");
	// return res.status(500).json({ err: "Username must be provided." });
	if (!user.password || user.password === "")
		throw new BadRequestError("Password must be provided.");
	// return res.status(500).json({ err: "Password must be provided." });

	const hashedPassword = await bcrypt.hash(user.password, 10);
	user.password = hashedPassword;
	users.push(user);

	res.status(StatusCodes.OK).json(user);
});

const refresh = asyncFunc(async (req, res, next) => {
	const refreshToken = req.body.token;

	if (!refreshToken || refreshToken === "")
		throw new BadRequestError("Refresh token not provided.");
	// return res.status(500).json({ err: "Refresh token not provided." });
	if (!refreshTokens.includes(refreshToken))
		throw new BadRequestError("Invalid refresh token.");

	const user = jwt.verify(refreshToken, "jwt_refresh_secret");
	const accessToken = generateAccessToken(user);

	res.status(StatusCodes.OK).json({ accessToken: accessToken });
});

module.exports = {
	login,
	register,
	refresh,
};
