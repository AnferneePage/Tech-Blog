const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const User = require("../models/index");
const BlogPost = require("../models/index");
const Comment = require("../models/index");
const withAuth = require("./utils/auth");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

// Set up Handlebars as the view engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);

// Routes
app.get("/", async (req, res) => {
  try {
    // Retrieve all blog posts from the database
    const allBlogPosts = await BlogPost.findAll();

    // Sort blog posts by creation date in descending order
    const sortedBlogPosts = allBlogPosts.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    // Render the dashboard template and pass the sorted blog posts to it
    res.render("home", { blogPosts: sortedBlogPosts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).send("An error occurred while fetching blog posts.");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email in the database
    const user = await User.findOne({ where: { email } });

    // If user doesn't exist, show an error message
    if (!user) {
      return res.render("login", { error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.redirect("/");
    } else {
      // Passwords do not match
      res.render("login", { error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("An error occurred during login.");
  }
});

app.get("/signup", (req, res) => {
  // Render the sign-up page
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Redirect to login or another page
    res.redirect("/login");
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).send("An error occurred during sign-up.");
  }
});

app.get("/dashboard", withAuth, (req, res) => {
  // Render the dashboard using Handlebars template
  res.render("dashboard");
});

app.post("/dashboard", (req, res) => {
  // Process the dashboard form submission
  // Redirect to the dashboard or perform other actions
});

app.delete("/delete/:postId", (req, res) => {
  const postId = req.params.postId;
  // Implement logic to delete the post with postId
  res.redirect("/dashboard");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
