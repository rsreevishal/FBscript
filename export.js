const admin = require("firebase-admin");
const fs = require('fs');
const serviceAccount = require("./serviceAccountKey.json");

let collectionName = process.argv[2];
let subCollection = process.argv[3];

// You should replace databaseURL with your own
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hackerrupt2k20-404ae.firebaseio.com"
});

let db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

let data = {};
data[collectionName] = {};

let results = db.collection(collectionName)
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      data[collectionName][doc.id] = doc.data();
    })
    return data;
  })
  .catch(error => {
    console.log(error);
  })

results.then(dt => {
  getSubCollection(dt).then(() => {
    var style = "<style>table {border:2px solid black;padding:10px;} td{border:2px solid black;padding:10px;} </style>";
    var html = "<html><head>" + style + "</head><body><h1>Hackerrupt Details</h1><table><th>Team name</th><th>College</th><th>Mobile</th><th>Email</th><th>Members</th>";
    var tt = 0;
    var tm = 0;
    result = data;
    Object.keys(result.users).forEach(function (key) {
      var user = result.users[key];
      var tmp = "<tr><td>" + user["team_name"] + "</td><td>" + user["college"] + "</td><td>" + user["mobile"] + "</td><td>" + user["email"] + "</td><td>" + user["team_no"] + "</td></tr>";
      html += tmp;
      tt += 1;
      tm += JSON.parse(user["team_no"]);
    });
    setTimeout(() => {
      html += "<h2>Total teams: " + tt + "</h2><h2>Total members: " + tm + "</h2>";
      html += "</table></body></html>";
      fs.writeFile("./result.html", html, (err) => {
        if (err) throw err;
      });
    }, 5000);
    fs.writeFile("firestore-export.json", JSON.stringify(data), function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  })
})

async function getSubCollection(dt) {
  for (let [key, value] of Object.entries([dt[collectionName]][0])) {
    if (subCollection !== undefined) {
      data[collectionName][key]['subCollection'] = {};
      await addSubCollection(key, data[collectionName][key]['subCollection']);
    }
  }
}

function addSubCollection(key, subData) {
  return new Promise(resolve => {
    db.collection(collectionName).doc(key).collection(subCollection).get()
      .then(snapshot => {
        snapshot.forEach(subDoc => {
          subData[subDoc.id] = subDoc.data();
          resolve('Added data');
        })
      })
  })
}
