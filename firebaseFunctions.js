const admin = require("firebase-admin");
/* Load in process ENV */
require("dotenv").config();

const firebaseInit = () => {
  admin.initializeApp({
    /* credential: admin.credential.cert(key), */
    credential: admin.credential.cert(
      JSON.parse(
        Buffer.from(process.env.GOOGLE_CONFIG_BASE64, "base64").toString(
          "ascii"
        )
      )
    ),
  });
  const db = admin.firestore();
  return db;
};

const getFirebaseDoc = async (document, db) => {
  let x = await db.collection("APY15").doc(document).get();
  return x;
};

module.exports = {
  firebaseInit,
  getFirebaseDoc,
};
