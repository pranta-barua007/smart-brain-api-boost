const jwt = require("jsonwebtoken");

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  }catch(err) {
    return {error: err.message}
  }
} 

module.exports = {
    signToken,
    verifyToken
}
