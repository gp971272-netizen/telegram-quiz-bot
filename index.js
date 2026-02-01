const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Token (BotFather se mila)
const token = process.env.BOT_TOKEN;

// ===== FIREBASE SETUP =====
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS || "./firebase-key.json");
// Firebase init
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://telegramquizbot-e5752-default-rtdb.firebaseio.com/"
});

const db = admin.database();
const bot = new TelegramBot(token, { polling: true });

// Health check route for Render
app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

// /start command
bot.onText(/\/start/, (msg) => {
  const id = msg.chat.id;
  const name = msg.from.first_name;

  db.ref("users/" + id).once("value", snap => {
    if (!snap.exists()) {
      db.ref("users/" + id).set({
        name: name,
        balance: 0
      });
      bot.sendMessage(id, "🎉 Welcome " + name + "! Wallet created.");
    } else {
      bot.sendMessage(id, "Welcome back " + name + "!");
    }
  });
});

// /balance command
bot.onText(/\/balance/, (msg) => {
  const id = msg.chat.id;
  db.ref("users/" + id + "/balance").once("value", snap => {
    bot.sendMessage(id, "💰 Your Balance: ₹" + (snap.val() || 0));
  });
});
