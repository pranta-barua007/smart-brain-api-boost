const { delToken } = require("../lib/redis");

const handleLogout = (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json('Unauthorized');
    }
    try{
        delToken(authorization);
        return res.status(200).json({success: 'true'});
    }catch(err) {
        return res.status(401).json('Unauthorized');
    }
}

module.exports = {
    handleLogout
}