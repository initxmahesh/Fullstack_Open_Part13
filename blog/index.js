const express = require("express");
const app = express();

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db.js");
const { errorHandler, unknownEndpoint } = require("./utils/middleware.js");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users.js")
const loginRouter = require("./controllers/login.js")

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
