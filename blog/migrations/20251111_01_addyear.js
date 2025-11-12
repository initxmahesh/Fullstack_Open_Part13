const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });
    await queryInterface.addConstraint("blogs", {
      fields: ["year"],
      type: "check",
      name: "year_checker",
      where: queryInterface.sequelize.literal(
        "year >= 1991 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)"
      ),
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint("blogs", "year_checker");
    await queryInterface.removeColumn("blogs", "year");
  },
};
