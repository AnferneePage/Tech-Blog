const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const sequelize = require("../config/connections");

// Define User model
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, // Ensure emails are unique
    validate: {
      isEmail: true, // Validate that the input is an email
    }
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

// Define BlogPost model
const BlogPost = sequelize.define("BlogPost", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

// Define Comment model
const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

// Establishing associations
User.hasMany(BlogPost, { foreignKey: "creator_id" });
BlogPost.belongsTo(User, { foreignKey: "creator_id" });

User.hasMany(Comment, { foreignKey: "creator_id" });
Comment.belongsTo(User, { foreignKey: "creator_id" });

BlogPost.hasMany(Comment, { foreignKey: "post_id" });
Comment.belongsTo(BlogPost, { foreignKey: "post_id" });


module.exports = { User, BlogPost, Comment };
