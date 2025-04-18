const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    const token = await req.cookies.access_token;
    if (!token) {
      return res.status(404).json({ error: "Token not found!" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);

    req.user = decoded.user;
    next();
  } catch (error) {
    console.log("Token error!" + error);
  }
};

module.exports = authUser;
