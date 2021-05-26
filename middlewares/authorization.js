const redisClient = require('../controllers/signin').redisClient;

//next() comesfrom express, allows to flow over the chain (next function)
const requireAuth = (req, res, next) => { 
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send('Unauthorized');
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send('Unauthorized');
    }
    return next();
  });
};

module.exports = {
  requireAuth
}