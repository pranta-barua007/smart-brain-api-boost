const redis = require("redis");
const { signToken } = require("./jwt");

// You will want to update your host to the proper address in production
const redisClient = redis.createClient(process.env.REDIS_URI);

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const delToken = (key) => Promise.resolve(redisClient.del(key));

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token, user };
    })
    .catch(console.log);
};

module.exports = {
    delToken,
    createSession,
    redisClient
}

