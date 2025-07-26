import express from "express";
import { json } from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(json());

import transactionsRoutes from "./routes/transactions";
import kycRoutes from "./routes/kyc";

app.use("/api/transactions", transactionsRoutes);
app.use("/api/kyc", kycRoutes);

app.get("/api/exchange-rate", (req, res) => {
    res.json({ rate: 21.75 }); // Mocked rate
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
