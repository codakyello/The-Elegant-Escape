const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException,", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");

  process.exit(1);
});

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("DB connection successful!");
  })
  .catch((e) => {
    console.log("not connected");
    console.log(e);
  });

const port = process.env.PORT; // Use environment variable or default port
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDAzZmU1ZjkzNjNiNTFiMDkyZjRkNSIsImlhdCI6MTcyNDkyMzg3OCwiZXhwIjoxNzMyNjk5ODc4fQ.sBEGhLW29qMkuKamBoV8jR25q4J-xOHK-5etaeO13H8

// Add a feature where once a new token has been assigned it should invalidate all older tokens.
