require("dotenv").config();
const app = require("./app"); // your Express app

const PORT = process.env.PORT || 5000; // Railway automatically provides PORT

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
