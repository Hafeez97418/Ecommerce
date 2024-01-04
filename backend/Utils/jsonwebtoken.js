const jwt = require("jsonwebtoken");
exports.GenrateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
    return token;
};
exports.VerifyToken = (token) => {
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  return verify ;
}