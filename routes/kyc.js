const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage(); // تخزين مؤقت في الذاكرة
const upload = multer({ storage });

router.post("/upload", upload.single("kycImage"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    // Simulate saving file to storage
    res.json({ message: "KYC uploaded successfully", fileName: req.file.originalname });
});

module.exports = router;
