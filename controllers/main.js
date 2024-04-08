const { asyncFunc } = require("../middleware/async");

const greeting = asyncFunc(async (req, res, next) => {
	const user = req.user;
	// throw new Error("Dekhte dibo nah");
	res.status(200).json({ msg: `Welcome, ${user.name}` });
});

module.exports = {
	greeting,
};
