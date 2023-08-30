const { User, BlogPost } = require("./models/index");
const sequelize = require("./config/connections")

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate([
      { username: "john_doe", password: "password1", email: "john@example.com" },
      { username: "jane_smith", password: "password2", email: "jane@example.com" },
      { username: "michael_brown", password: "password3", email: "michael@example.com" },
      { username: "emily_wilson", password: "password4", email: "emily@example.com" },
      { username: "david_jones", password: "password5", email: "david@example.com" },
      { username: "sarah_jackson", password: "password6", email: "sarah@example.com" },
    ]);
    

    await BlogPost.bulkCreate([
      {
        title: "The Power of Deep Learning in Image Recognition",
        contents: `
          Deep learning has revolutionized image recognition in recent years.
          In this blog post, we'll delve into the architecture of convolutional neural networks (CNNs),
          discuss various techniques like transfer learning, and explore real-world applications.
          We'll see how CNNs outperform traditional methods and open up new possibilities for image analysis.`,
        creator_id: users[0].id,
      },
      {
        title: "Modern Web Development: Beyond HTML and CSS",
        contents: `
          Modern web development extends beyond HTML and CSS.
          In this comprehensive guide, we'll explore the intricacies of frontend and backend development.
          From popular frontend frameworks like React, Angular, and Vue.js to backend technologies like Node.js and Express,
          we'll discuss best practices, tools, and techniques for building robust and scalable web applications.`,
        creator_id: users[1].id,
      },
      {
        title: "Exploring the AI Ethics Debate",
        contents: `
          As AI continues to evolve, questions about its ethical implications become more pressing.
          In this thought-provoking blog post, we'll dive into the AI ethics debate.
          We'll discuss issues like bias in AI algorithms, job displacement, and data privacy.
          Join the conversation on the ethical challenges and responsibilities of AI developers and users.`,
        creator_id: users[4].id,
      },
      {
        title: "Demystifying Quantum Computing",
        contents: `
          Quantum computing is poised to revolutionize various industries,
          from cryptography to drug discovery. Join us on a journey to understand
          the fundamental principles of quantum mechanics and how they apply to
          quantum computers. We'll discuss qubits, superposition, and quantum algorithms.`,
        creator_id: users[2].id,
      },
      {
        title: "The Rise of No-Code and Low-Code Development",
        contents: `
          No-code and low-code development platforms are changing the way we build software.
          In this blog post, we'll explore the benefits and challenges of these platforms.
          We'll also analyze real-world use cases and discuss their impact on the development landscape.`,
        creator_id: users[3].id,
      },
      {
        title: "Blockchain Beyond Cryptocurrencies",
        contents: `
          While blockchain gained popularity through cryptocurrencies like Bitcoin,
          its applications go far beyond digital currencies. This post delves into
          the potential of blockchain technology in industries such as supply chain,
          healthcare, and finance. We'll also examine smart contracts and decentralized applications.`,
        creator_id: users[4].id,
      },
      {
        title: "Navigating the Cloud: AWS vs. Azure vs. Google Cloud",
        contents: `
          Choosing the right cloud provider can be challenging. This blog post compares
          the leading cloud platforms: Amazon Web Services (AWS), Microsoft Azure,
          and Google Cloud. We'll discuss key features, pricing, and use cases to help
          you make an informed decision for your cloud infrastructure needs.`,
        creator_id: users[5].id,
      },
      {
        title: "Data Privacy in the Digital Age",
        contents: `
          In an era of constant data collection, privacy is a growing concern.
          This post examines the intricacies of data privacy, including regulations
          like GDPR and CCPA. We'll explore techniques for protecting personal data
          and the role of individuals, organizations, and governments in safeguarding privacy.`,
        creator_id: users[0].id,
      },
    ]);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }

  console.log("db has been seeded")
}

seedDatabase();
