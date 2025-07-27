const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const transactionsRoutes = require("./routes/transactions");
const kycRoutes = require("./routes/kyc");

app.use("/api/transactions", transactionsRoutes);
app.use("/api/kyc", kycRoutes);

app.get("/api/exchange-rate", (req, res) => {
    res.json({ rate: 21.75 }); // Mocked rate
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
