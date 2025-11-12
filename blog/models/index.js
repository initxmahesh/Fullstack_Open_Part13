const Blog = require("./blog");
// const ReadingList = require("./readinglist");
const User = require("./user");

User.hasMany(Blog);
Blog.belongsTo(User);

// User.belongsToMany(Blog, { through: ReadingList, as: "readinglist" });
// Blog.belongsToMany(User, { through: ReadingList, as: "savedBy" });

module.exports = {
  Blog,
  User,
  // ReadingList,
};
