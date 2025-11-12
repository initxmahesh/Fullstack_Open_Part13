const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models");
const { tokenExtractor } = require("../utils/middleware");

router.get("/", async (req, res, next) => {
  try {
    const where = {};

    if (req.query.userId) {
      where.userId = req.query.userId;
    }

    if (typeof req.query.read !== "undefined") {
      where.read = req.query.read === "true";
    }

    const readingLists = await ReadingList.findAll({
      where,
      include: {
        model: Blog,
        attributes: ["id", "url", "title", "author", "likes", "year"],
      },
    });

    res.status(200).json(readingLists);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { blogId, userId } = req.body;
    if (!blogId || !userId) {
      return res.status(400).json({ error: "blogId and userId needed" });
    }

    const addList = await ReadingList.create({ blogId, userId });
    res.status(201).json(addList);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id);
    if (!readingList) {
      return res.status(404).json({ error: "Particular list is not found" });
    }
    const user = await User.findByPk(req.decodedToken.id);

    if (readingList.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this field" });
    }

    readingList.read = req.body.read;
    await readingList.save();
    res.json(readingList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
