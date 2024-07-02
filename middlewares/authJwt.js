const jwt = require('jsonwebtoken');
const db = require('../models');
const logger = require('../utils/logger');
const User = db.user;
const { JWT_SECRET } = process.env;

const isAdmin = async (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }
  if(token.startsWith('Bearer ')){
    token=token.slice(7,token.length)
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findOne({ where: { id: decoded.id } });

    if (!admin||admin.role!=='admin') {
      return res.status(401).json({ message: "Unauthorized! Admin not found." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized! Invalid token." });
  }
};

const isUser = async (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }
  if(token.startsWith('Bearer ')){
    token=token.slice(7,token.length)
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user||user.role!=='user') {
      return res.status(401).json({ message: "Unauthorized! User not found." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized! Invalid token." });
  }
};

module.exports = {isAdmin,isUser};
