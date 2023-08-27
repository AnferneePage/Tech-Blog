const { Sequelize, DataTypes } = require("sequelize");

// Create a Sequelize instance and connect to the database
const sequelize = new Sequelize(
  "your_database_name",
  "your_username",
  "your_password",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

// Define the User model
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

// Define the BlogPost model
const BlogPost = sequelize.define("BlogPost", {
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contents: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define the Comment model
const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Establish associations
User.hasMany(BlogPost, { foreignKey: "creator_id" });
BlogPost.belongsTo(User, { foreignKey: "creator_id" });

User.hasMany(Comment, { foreignKey: "creator_id" });
Comment.belongsTo(User, { foreignKey: "creator_id" });

BlogPost.hasMany(Comment, { foreignKey: "post_id" });
Comment.belongsTo(BlogPost, { foreignKey: "post_id" });

// Sync the models with the database
sequelize
  .sync({ force: true }) // Use `force: true` only during development to recreate tables
  .then(() => {
    console.log("Database tables created");
  })
  .catch((err) => {
    console.error("Error syncing models:", err);
  });

module.exports = { User, BlogPost, Comment };
