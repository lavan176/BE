const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Enable CORS
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // Increase payload size limit

// Ensure `uploads` directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post("/upload", (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send("No image provided!");
  }

  const fileName = `photo_${Date.now()}.jpeg`;
  const imageBuffer = Buffer.from(image.split(",")[1], "base64");
  fs.writeFileSync(path.join(uploadDir, fileName), imageBuffer);

  res.send({ message: "Image uploaded successfully!", fileName });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
