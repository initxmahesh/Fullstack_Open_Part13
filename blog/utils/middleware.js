const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.errors.map((e) => e.message) });
  }

  if (error.name === "SequelizeDatabaseError") {
    return res.status(400).json({ error: error.message });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "Unique constraint violation" });
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({ error: "Foreign key constraint violation" });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }

  next(error);
};

module.exports = {
  errorHandler,
  tokenExtractor,
  unknownEndpoint,
};
