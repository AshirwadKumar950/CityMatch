require("dotenv").config(); // It loads environment variables from a .env file into your app.

const app = require("./app");
const supabase = require("./config/supabaseClient");

const PORT = process.env.PORT || 5000;

// Check Supabase connection (optional but recommended)
const checkDBConnection = async () => {
  try {
    const { error } = await supabase
      .from("places")
      .select("*")
      .limit(1);

    if (error) throw error;

    console.log("✅ Supabase connected successfully");
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await checkDBConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();