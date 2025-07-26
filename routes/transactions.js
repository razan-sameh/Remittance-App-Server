import { Router } from "express";
const router = Router();
import { initializeApp, credential as _credential, messaging } from "firebase-admin";

// Initialize Firebase
import serviceAccount from "../firebase/serviceAccountKey.json";
initializeApp({
    credential: _credential.cert(serviceAccount),
});

let transactions = []; // Memory only – replace with DB later

// Send Money
router.post("/", (req, res) => {
    const { sender, receiver, amount, fcmToken } = req.body;
    const newTransaction = {
        id: transactions.length + 1,
        sender,
        receiver,
        amount,
        status: "Created",
        fcmToken,
        createdAt: new Date(),
    };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

// Get all transactions
router.get("/", (req, res) => {
    res.json(transactions);
});

// Update transaction status
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const tx = transactions.find(t => t.id == id);
    if (!tx) return res.status(404).json({ message: "Not found" });

    tx.status = status;

    // Send Firebase notification
    if (tx.fcmToken) {
        await messaging().send({
            notification: {
                title: "Transaction Update",
                body: `Your transaction is now ${status}`,
            },
            token: tx.fcmToken,
        });
    }

    res.json(tx);
});

export default router;
