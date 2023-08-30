const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const { User } = require("./models/index");
const { BlogPost } = require("./models/index");
const { Comment } = require("./models/index");
const withAuth = require("./utils/auth");
const bcrypt = require("bcrypt");
const path = require("path");
const helper = require('./utils/helper');

const app = express();
const port = 3000;

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



app.use(session({
  secret: "your_secret_key", // Replace with your actual secret
  resave: false,
  saveUninitialized: true
}));


app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");



app.use(express.urlencoded({ extended: false }));

const saltRounds = 10; // You can adjust this value

const plainPassword = 'myPassword';

bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    // Store the hashedPassword in your database
    console.log('Hashed Password:', hashedPassword);
  }
});

// Routes
app.get("/", async (req, res) => {
  try {
    const blogs = await BlogPost.findAll({
      include: [
        { model: User, attributes: ["username"] }
      ]
    });

    res.render("main", { blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("An error occurred while fetching blogs.");
  }
});




app.get("/home", withAuth, (req, res) => {
  try {
    res.render("partials/mainLoggedIn");
  } catch (error) {
    console.error("Error rendering mainLoggedIn:", error);
    res.status(500).send("An error occurred while rendering mainLoggedIn.");
  }
});

app.get("/login", (req, res) => {
  res.render('partials/login')
})


app.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      return res.render('partials/login', { error: 'Incorrect email or password, please try again' });
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      return res.render('partials/login', { error: 'Incorrect email or password, please try again' });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      // Redirect to a different page after successful login
      res.redirect('/home'); // Change this to the appropriate route
    });

  } catch (err) {
    res.status(400).json(err);
  }
});


app.post('/logout', (req, res) => {
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
  try {
    const { username, email, password } = req.body;

    const saltRounds = 10; // You can adjust this value
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const newUser = await User.create({ username, email, password: hashedPassword });

    // Redirect to a different page after successful signup
    res.redirect("/login"); // Change "/login" to your desired redirect path
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("An error occurred during signup.");
  }
});


app.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userId = req.session.userId; 

    // Fetch the user's posts from the database
    const userPosts = await BlogPost.findAll({ where: { userId } });

    // Render the 'dashboard' view and pass the user's posts to it
    res.render("partials/dashboard", { userPosts, logged_in: true }); 
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).send("An error occurred while fetching user posts.");
  }
});

app.post("/dashboard", async (req, res) => {
  const { title, contents } = req.body;

  try {
    // Create a new blog post in the database
    await BlogPost.create({
      title,
      contents,
      // You might also associate the post with the creator's ID here if needed
    });

    // Redirect back to the dashboard
    res.redirect("/");
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
