const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const { User, Session } = require("../models");

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);

    try {
      const decodedToken = jwt.verify(token, SECRET);
      const session = await Session.findOne({
        where: { token: token },
        include: {
          model: User,
          attributes: ["id", "disabled"],
        },
      });

      if (!session) {
        return res.status(401).json({ error: "session expired" });
      }

      if (session.userId !== decodedToken.id) {
        await session.destroy();
        return res.status(401).json({ error: "session mismatch" });
      }

      const user = await User.findByPk(decodedToken.id);

      if (!user) {
        await session.destroy();
        return res.status(401).json({ error: "user not found" });
      }

      if (user.disabled) {
        return res.status(403).json({ error: "account disabled" });
      }

      req.decodedToken = decodedToken;
      req.session = session;
      req.user = user;
      next();
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(401).json({ error: "token invalid" });
      }
      next(error);
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
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
