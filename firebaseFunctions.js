const admin = require("firebase-admin");

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
  /* .then((res) => {
      //console.log(res);
      return res;
    })
    .catch((e) => {
      console.log("There was an error: ", e);
    }); */
};

/* const updateFirebase = (document, field) => {
  db.collection("APYDump")
    .doc(document)
    .get()
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log("There was an error: ", e);
    });
}; */

module.exports = {
  firebaseInit,
  getFirebaseDoc,
};
