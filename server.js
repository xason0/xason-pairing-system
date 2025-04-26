const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bot = require("./login");

app.get("/", (req, res) => {
    res.send("Xason Pairing Server is Running!");
});

app.get("/code", (req, res) => {
    const code = bot.getPairingCode();
    if (code) {
        res.json({ code });
    } else {
        res.status(503).json({ error: "Pairing code not ready yet" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
