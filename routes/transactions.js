const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Initialize Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

let transactions = []; // Memory only – replace with DB later

// Send Money
router.post("/", async (req, res) => {
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
    await admin.messaging().send({
        notification: {
            title: "Transaction Created",
            body: `Your transaction to ${receiver} has been Created.`,
        },
        token: newTransaction.fcmToken,
    });
    // Automatically update the transaction after delay
    setTimeout(async () => {
        newTransaction.status = "Completed";

        if (newTransaction.fcmToken) {
            await admin.messaging().send({
                notification: {
                    title: "Transaction Completed",
                    body: `Your transaction to ${receiver} has been completed.`,
                },
                token: newTransaction.fcmToken,
            });
        }
    }, 10000); // 10 seconds later
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
        await admin.messaging().send({
            notification: {
                title: "Transaction Update",
                body: `Your transaction is now ${status}`,
            },
            token: tx.fcmToken,
        });
    }

    res.json(tx);
});

module.exports = router;
