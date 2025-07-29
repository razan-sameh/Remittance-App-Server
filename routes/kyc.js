const express = require("express");
const multer = require("multer");
const router = express.Router();

const kycList = [];

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/submit", upload.fields([
    { name: 'nationalId', maxCount: 1 },
    { name: 'selfiePhoto', maxCount: 1 }
]), (req, res) => {
    const { fullName, address, phone } = req.body;

    if (!fullName || !address || !phone || !req.files?.nationalId || !req.files?.selfiePhoto) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const kycEntry = {
        id: Date.now(),
        fullName,
        address,
        phone,
        nationalId: req.files.nationalId[0].originalname,
        selfiePhoto: req.files.selfiePhoto[0].originalname,
        status: 'approved',
    };

    kycList.push(kycEntry);

    res.json({ message: "KYC approved successfully", status: 'approved' });
});

module.exports = router;
