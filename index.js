const { google } = require("googleapis");
const express = require("express");
const cors = require("cors");
const sheets = google.sheets("v4");
const app = express();
const PORT = 5000;
require("dotenv").config();

// const fs = require("fs");
// const csv = require("csv-parser");
// const admin = require("firebase-admin");

// // Load the Firestore service account credentials
// const FIRESTORE_CREDENTIALS = JSON.parse(
//   fs.readFileSync(process.env.FIRESTORE_SERVICE_ACCOUNT_KEY)
// );

// // Initialize Firestore
// admin.initializeApp({
//   credential: admin.credential.cert(FIRESTORE_CREDENTIALS),
//   databaseURL: process.env.FIREBASE_DB_URL,
// });
// const db = admin.firestore();
// const studentsCollection = db.collection("students");

// const loadCSV = async () => {
//   try {
//     const results = [];
//     fs.createReadStream("./data/data.csv")
//       .pipe(csv())
//       .on("data", (data) => results.push(data))
//       .on("end", async () => {
//         for (const row of results) {
//           const studentData = {
//             idCall: row.idCall,
//             idClass: row.idClass,
//             firstName: row.firstName,
//             middleName: row.middleName,
//             lastName: row.lastName,
//             image: row.image, // Google Drive link
//             whatsappNo: row.whatsappNo,
//             fatherNo: row.fatherNo,
//             motherNo: row.motherNo,
//             team: row.team,
//             birthYear: row.birthYear,
//             subTeam: row.subTeam,
//             instrument: row.instrument,
//             address: row.address,
//             email: row.email,
//           };

//           try {
//             await studentsCollection.add(studentData);
//             console.log(
//               `Successfully added student: ${row.firstName} ${row.lastName}`
//             );
//           } catch (error) {
//             console.error(
//               `Failed to add student: ${row.firstName} ${row.lastName}`,
//               error
//             );
//           }
//         }
//         console.log("All data uploaded successfully.");
//         // Call updateDocuments after CSV data is loaded
//         await updateDocuments();
//       });
//   } catch (error) {
//     console.error("Error loading CSV:", error);
//   }
// };

// const updateDocuments = async () => {
//   try {
//     const querySnapshot = await studentsCollection.get();
//     console.log(`Found ${querySnapshot.size} documents in the collection.`);

//     const batch = db.batch();

//     querySnapshot.forEach((document) => {
//       const data = document.data();
//       const updatedData = {};

//       if (data.firstName) {
//         updatedData.firstName = data.firstName.toLowerCase();
//       }
//       if (data.middleName) {
//         updatedData.middleName = data.middleName.toLowerCase();
//       }
//       if (data.lastName) {
//         updatedData.lastName = data.lastName.toLowerCase();
//       }
//       if (data.team) {
//         updatedData.team = data.team.toLowerCase();
//       }
//       if (data.instrument) {
//         updatedData.instrument = data.instrument.toLowerCase();
//       }

//       if (Object.keys(updatedData).length > 0) {
//         const docRef = studentsCollection.doc(document.id);
//         batch.update(docRef, updatedData);
//       }
//     });

//     await batch.commit();
//     console.log("Documents updated successfully.");
//   } catch (error) {
//     console.error("Error updating documents:", error);
//   }
// };

// loadCSV().catch((error) => {
//   console.error("Error loading CSV:", error);
// });

app.use(
  cors({
    origin: "https://aadijinband.web.app/",
    methods: ["GET"],
  })
);

async function getClassData() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.SERVICE_ACCOUNT_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const client = await auth.getClient();
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = "Class_Att_Dashboard!A:AZ";

  const response = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId,
    range,
  });

  return response.data.values;
}

app.get("/api/data", async (req, res) => {
  try {
    const data = await getClassData();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
