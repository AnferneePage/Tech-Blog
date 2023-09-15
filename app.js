const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const { User } = require("./models/index");
const { BlogPost } = require("./models/index");
const { Comment } = require("./models/index");
const withAuth = require("./utils/auth");
const bcrypt = require("bcrypt");
const path = require("path");
const helper = require("./utils/helper");

const app = express();
const port = process.env.PORT || 3005;

const hbs = exphbs.create({
  partialsDir: path.join(__dirname, "views", "partials"),
  defaultLayout: false,
  helpers: {
    formatDateWithoutSeconds: helper.formatDateWithoutSeconds,
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.use(
  session({
    secret: "your_secret_key", // Replace with your actual secret
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", async (req, res) => {

  
    try {
      const blogs = await BlogPost.findAll({
        include: [{ model: User, attributes: ["username"] }],
        order: [["created_at", "DESC"]],
      });
      
      blogs.created_at
  
      res.render("main", { blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).send("An error occurred while fetching blogs.");
    }
  
});

app.get("/blog-feed", withAuth,  async (req, res) => {
  
    try {
      const blogs = await BlogPost.findAll({
        include: [{ model: User, attributes: ["username"] }],
        order: [["created_at", "DESC"]],
      });
  
      res.render("partials/mainLoggedIn", { blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      res.status(500).send("An error occurred while fetching blogs.");
    }
});

app.get("/login", (req, res) => {
  res.render("partials/login");
});

app.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log(userData)

    if (!userData) {
      return res.render("partials/login", {
        error: "Incorrect email, please try again",
        
      });
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      return res.render("partials/login", {
        error: "Incorrect password, please try again",
        
      });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

  
      res.redirect("/blog-post");
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

app.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

app.get("/signup", (req, res) => {
  // Render the sign-up page
  res.render("partials/signup");
});

app.post("/signup", async (req, res) => {
  const saltRounds = 10;

  const plainPassword = "myPassword";

  bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
    }
  });

  try {
    const { username, email, password } = req.body;
    console.log(password);

    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    req.session.user_id = newUser.id; 
    req.session.logged_in = true;

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("An error occurred during signup.");
  }
});

app.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userId = req.session.user_id;

    // Fetch the user's posts from the database
    const userPosts = await BlogPost.findAll({ where: { creator_id: userId } });

    // Render the 'dashboard' view and pass the user's posts to it
    res.render("partials/dashboard", { userPosts, logged_in: true });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).send("An error occurred while fetching user posts.");
  }
});


app.post("/dashboard", async (req, res) => {
  const { title, contents} = req.body;
  console.log(title)
  console.log(contents)

  try {
    // Create a new blog post in the database
    await BlogPost.create({
      title,
      contents,
      creator_id: req.session.user_id,
    });

    req.session.logged_in = true;
    res.redirect("/blog-feed");
    
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).send("An error occurred while creating the blog post.");
  }
});

app.delete("/dashboard/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    // Find the post to be deleted by its postId
    const postToDelete = await BlogPost.findByPk(postId);

    if (!postToDelete) {
      return res.status(404).send("Post not found");
    }

    // Delete the post from the database
    await postToDelete.destroy();

    // Redirect back to the dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("An error occurred while deleting the post.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
