const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const app = express();

// Enable CORS
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // Increase payload size limit

mongoose.connect(
    "mongodb+srv://lavank110:Lavan%40123@cluster0.pid8l.mongodb.net/mydatabase?retryWrites=true&w=majority"
);

const imageSchema = new Schema({
  image: Buffer,
  contentType: String,
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model("Image", imageSchema);

app.post("/upload", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send("No image provided!");
  }

  try {
    const imageBuffer = Buffer.from(image.split(",")[1], "base64");

    const newImage = new Image({
      image: imageBuffer,
      contentType: "image/jpeg" // Change if the image type is different
    });

    await newImage.save();

    res.send({ message: "Image uploaded and saved to MongoDB!", imageId: newImage._id });
  } catch (err) {
    res.status(500).send("Error saving image to MongoDB!");
  }
});

app.delete("/images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Image.findByIdAndDelete(id);

    if (result) {
      res.send({ message: "Image deleted successfully!" });
    } else {
      res.status(404).send({ message: "Image not found!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error deleting image from MongoDB!" });
  }
});
// Fetch all images
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();

    const formattedImages = images.map((img) => ({
      id: img._id,
      image: `data:${img.contentType};base64,${img.image.toString("base64")}`,
      createdAt: img.createdAt,
    }));

    res.json(formattedImages);
  } catch (err) {
    res.status(500).send("Error fetching images!");
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
