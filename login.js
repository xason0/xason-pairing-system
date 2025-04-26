global.crypto = require("crypto");

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
let pairingCode = null;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        printQRInTerminal: false,
        auth: state,
        browser: ['Xason', 'Chrome', '110.0.0.1'],
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
        try {
            const code = await sock.requestPairingCode("+447405817307");
            pairingCode = code;
            console.log("==== PAIRING CODE ====");
            console.log(code);
            console.log("======================");
        } catch (err) {
            console.error("Failed to generate pairing code:", err);
        }
    }

    sock.ev.on("connection.update", ({ connection }) => {
        if (connection === "open") {
            console.log("Bot connected!");
        } else if (connection === "close") {
            console.log("Disconnected. Trying again...");
            startBot();
        }
    });
}

startBot();

module.exports = {
    getPairingCode: () => pairingCode
};
