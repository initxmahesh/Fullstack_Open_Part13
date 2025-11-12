const Blog = require("./blog");
const ReadingList = require("./readinglist");
const User = require("./user");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList, as: "marked" });

ReadingList.belongsTo(User);
ReadingList.belongsTo(Blog);

module.exports = {
  Blog,
  User,
  ReadingList,
};
