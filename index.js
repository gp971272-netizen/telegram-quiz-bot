const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const express = require("express");
const app = express();
// ===== TELEGRAM TOKEN =====
const token = "8200781036:AAHkoKh6HQPg1WZoz08R-D1u_x3cT7y65w8";

// ===== FIREBASE SETUP =====
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://telegramquizbot-e5752-default-rtdb.firebaseio.com/"
});

const db = admin.database();
const bot = new TelegramBot(token, { polling: true });

// START COMMAND = WALLET CREATE
bot.onText(/\/start/, (msg) => {
  const id = msg.chat.id;
  const name = msg.from.first_name;

  const ref = db.ref("users/" + id);

  ref.once("value", snap => {
    if (!snap.exists()) {
      ref.set({
        name: name,
        balance: 0,
        total_played: 0,
        total_won: 0
      });
      bot.sendMessage(id, `🎉 Welcome ${name}\nWallet created!\nUse /balance`);
    } else {
      bot.sendMessage(id, `Welcome back ${name} 👋\nUse /balance`);
    }
  });
});

// BALANCE COMMAND
bot.onText(/\/balance/, (msg) => {
  const id = msg.chat.id;

  db.ref("users/" + id + "/balance").once("value", snap => {
    bot.sendMessage(id, `💰 Balance: ₹${snap.val() || 0}`);
  });
app.get("/", (req, res) => {
  res.send("Bot is running");
});
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
