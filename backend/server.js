/* The libraries imported*/
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

/* Instance Created*/
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Features data
const features = [
    { title: "Easy Demand and Supply Track", description: "Track received and left at one click", image: "https://via.placeholder.com/300" },
    { title: "Order Hassle Free", description: "A brief description of Feature Two.", image: "https://via.placeholder.com/300" },
    { title: "Credit Payment Gateway", description: "A brief description of Feature Three.", image: "https://via.placeholder.com/300" },
    { title: "Unique Shelves Integrated", description: "A brief description of Feature Four.", image: "https://via.placeholder.com/300" },
    { title: "Instant Temporary Loans", description: "A brief description of Feature Five.", image: "https://via.placeholder.com/300" },
    { title: "Discount Section Retailerwise", description: "A brief description of Feature Six.", image: "https://via.placeholder.com/300" }
];

// Endpoint to serve features data
app.get("/api/features", (req, res) => {
    res.json(features);
});


app.get("/", (req, res) => {
    res.send("Backend is running!");
});
app.post("/data", (req, res) => {
    console.log(req.body);
    res.json({ message: "Data received", data: req.body });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));