const jwt = require("jsonwebtoken");
exports.GenrateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET);
    return token;
};
