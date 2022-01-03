const { redisClient, delToken } = require("../lib/redis");
const { verifyToken } = require("../lib/jwt");

//next() comesfrom express, allows to flow over the chain (next function)
const requireAuth = (req, res, next) => { 
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Unauthorized');
  }

  const isTokenVerified = verifyToken(authorization);
  if(isTokenVerified.error) {
    delToken(authorization);
    return res.status(401).json('Unauthorized');
  }

  return redisClient.get(authorization, (err, reply) => {
    console.log(reply);
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    return next();
  });
};

module.exports = {
  requireAuth
}