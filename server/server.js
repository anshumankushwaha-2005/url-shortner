require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Snipify API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
}

start();

// Fail loudly instead of hanging on unexpected rejections.
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});
