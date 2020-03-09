const fs = require('fs');

var result;
var style = "<style>table {border:2px solid black;padding:10px;} td{border:2px solid black;padding:10px;} </style>";
var html = "<html><head>"+style+"</head><body><h1>Hackerrupt Details</h1><table><th>Team name</th><th>College</th><th>Mobile</th><th>Email</th><th>Members</th>";
var tt = 0;
var tm = 0;
fs.readFile('./firestore-export.json',(err,data)=>{
    if(err)throw err;
    else{
        result = JSON.parse(data);
        Object.keys(result.users).forEach(function(key) {
            var user = result.users[key];
            var tmp = "<tr><td>"+user["team_name"]+"</td><td>"+user["college"]+"</td><td>"+user["mobile"]+"</td><td>"+user["email"]+"</td><td>"+user["team_no"]+"</td></tr>";
            html += tmp;
            tt += 1;
            tm += JSON.parse(user["team_no"]);
        });
        setTimeout(()=>{
            html += "<h2>Total teams: "+tt+"</h2><h2>Total members: "+tm+"</h2>";
            html+= "</table></body></html>";
            fs.writeFile("./result.html",html,(err)=>{
                if(err)throw err;
            });
        },5000);
    }
});