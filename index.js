const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');

// ===== TELEGRAM TOKEN =====
const token = "8200781036:AAEkYdvjM2QIGWpj-f8B-SVPyUlwv_7WtTk";

// ===== FIREBASE SETUP =====
const serviceAccount = require("{
  "type": "service_account",
  "project_id": "telegramquizbot-e5752",
  "private_key_id": "2a7f696db3fdd7a27b043d8ae0c5e811c0fdbfb5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxfFV6E8nHBdRW\nz1Ra0EKm98VYUnybPplcPp6hwtWYG8tZ4JbJiCIBkdBpF3DpAf+dIayvuAHsnjwV\nLQkHwuyhOeSmeUuA4zAXHXmDwTm8m27ipCwGj7MjJjzAdAcL6JkKBBbipciUPlZ5\nAp3tZyBhFgMrAJeBn+PQHOlhvG70Lyu3L17htUVTS9R1jBu7tCynR/5kSKqjcKIw\nu2F40UIiycvXqTzvk58uQsI6rkViJ5hU6/lV7E3pSaFtl8+DXsop1b4eK4NRG7y+\nPBPVhaiB4PQzqWaOPWo+3otvWWwmCWUUymdkUL7OBs9CuF/fYw3LtUX0/vezH33l\ntzIkAZ/HAgMBAAECggEAJmMUX7Nw9E1D+ESeY4fgqpkzQx+QGMmoxMU8bRMlPGFi\nkX1cT5lUdY9yipBJ2POYNAWJAnZjYCh3KUNUzStxH4vUctcQJ/+7Mnyq//6mPK9H\ng9hrNz4UShlmkV9m+MHle7+XrYyavclfzYtt2d9wpt7qb34QxrXswWHHbl6hhsli\nklFkKM8kLquCNjqAEOsMaPk6VvVhLX/Oc+GLEQHqA4Nm9pz5ykDvoPamsqsnbkR8\ncBk2DEJPUutB5T3Hc7E8WQA9Wot1i4KGi5IFuQ6OBdAfKOfCFayetYUiVmWxlUKf\nxkOgik69PAZ7WjtbqoYPIkn7SHA480K9/XS+tYypFQKBgQDlHZ/i6mGwwPaqk3HT\nEvzU8yZRd1125t+Yue4UHMLP6nGf0TngdWWSB9uQkzkKDQk9QicdJJLnHozux3Ea\nyCUSCTYu3jYcKpw4gLDafC2Ec4x7+ghME7i70Y2wYsiomaG39eviOLKWOY97F1T+\ngXpwsfZZJhPNZOQawNg448v06wKBgQDGT805jb0gbWLh/RvEvKKMhX8f2cnjCPRD\nRc26QUzMzeoxPo82fd6DvNxlM8zuqFo0cv5BCzCS9HuTHYBkNWuMN8QwaJI9VOT/\nguU0pt1Ki6ZdrPBO8iOUpJooPVHLwgFO4eOuFn2qrwnUXmolWDTaiVTFxZAo7uw2\nz4oYSFt5lQKBgHVXp9SSz/ezzGFuZISDHASAh6Z/qNnFwsy4pSud01SjMRB2GttP\npPaWmahBDpyMMqgyIlA1tBs0tV9xvAbIbNwA5cQ5QKNKW3pAxtMPeEx21YOFegxk\nqV9gIt4sqbJYBNBv3iCdgzGXR1n2iCxU6f2f15iu/MNcIctl6xev63yDAoGAC0ZS\nNql2TTeq3YpUX9URsMeOOLNbJQtHR+PaFHLN+P7kB7S007ZIRlkgdqiBSDhOGJlJ\nF02Zj2FS/UQ6HnhjCu/Iua/YUKBY/KXmfh3WivxxkvXYG8TsfPD2yr7hvaHkDSYO\nmcExl9inyGktw73GE36nUS8wSQN8bolSIptKiBkCgYEAjIBKx2OM/Vkf5vuEzFNd\nRmFOV6ZPuY9p6oIbNVHX/eOtji4mOgpLpCRsVtAxdxcI/jRWnlUmrglTDkv1Kc9B\nLI+0blvBlR70naqxZvugxaSvAbGAWH9wVRK423yD5wthGrQiCYKTEkI9Db6iqhZ2\nNJigVevdFKa1aHGczWU0Byg=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@telegramquizbot-e5752.iam.gserviceaccount.com",
  "client_id": "103522549306999037132",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40telegramquizbot-e5752.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}");

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
});