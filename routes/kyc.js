import { Router } from "express";
import multer, { memoryStorage } from "multer";

const router = Router();

// تخزين الصورة في الذاكرة فقط (وليس على القرص)
const storage = memoryStorage();
const upload = multer({ storage });

// endpoint لرفع صورة فقط
router.post("/upload", upload.single("kycImage"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    // ممكن هنا تعمل حفظ فعلي للفايل في storage أو s3 مثلاً

    res.json({
        message: "Image uploaded successfully",
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
    });
});

export default router;
