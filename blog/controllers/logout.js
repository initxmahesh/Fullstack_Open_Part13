const router = require("express").Router();
const { tokenExtractor } = require("../utils/middleware");
const { Session } = require("../models");

router.delete("/", tokenExtractor, async (req, res, next) => {
  try {
    if (req.session.userId !== req.decodedToken.id) {
      return res
        .status(401)
        .json({ error: "unauthorized, cannot delete other user's session" });
    }
    const deleted = await Session.destroy({
      where: {
        id: req.session.id,
        userId: req.decodedToken.id,
      },
    });
    if (deleted > 0) {
      return res.status(204).end();
    } else {
      return res.status(404).json({error: "session not found"});
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
