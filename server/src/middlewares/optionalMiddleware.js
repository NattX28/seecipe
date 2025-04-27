const { verifyToken } = require("../utils/jwt");

const optionalAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    req.user = null; // แม้ token พัง ก็ถือว่าผ่าน แต่ไม่มี user
    next();
  }
};

module.exports = { optionalAuthMiddleware };
