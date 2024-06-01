import jwt from "jsonwebtoken";
export const createEmailVerificationToken = (data) => {
	const token = jwt.sign(data, process.env.JWT_SECRET, {
		expiresIn: "30m",
	});
	return token;
};

export const createUserLoginToken = (data) => {
	const token = jwt.sign(data, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
	return token;
};
