const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id);
    next();
  } catch (error) {
    next(error);
  }
};

router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      res.json(req.blog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      await req.blog.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: "blog is not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      req.blog.likes = req.body.likes;
      await req.blog.save();
      res.json(req.blog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
