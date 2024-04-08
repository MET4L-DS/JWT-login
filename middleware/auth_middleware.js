const { BadRequestError } = require("../error");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (
			!authHeader ||
			authHeader === "" ||
			!authHeader.startsWith("Bearer ")
		)
			throw new BadRequestError("Invalid access token.");
		// return res.status(500).json({ err: "Invalid access token." });

		const accessToken = authHeader.split(" ")[1];
		const user = jwt.verify(accessToken, "jwt_secret_key");
		req.user = user;
		next();
	} catch (error) {
		// res.status(500).json({ err: "Authentication failed." });
		next(error);
		// res.status(500).json({ err: error });
	}
};

module.exports = {
	authMiddleware,
};
