const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createToken = (user) => {
  let token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET, {
    expiresIn: "1h",
  });

  return token;
};

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
};
