
var app = require("express")()
var mc = require("mongodb").MongoClient
var url = "mongodb://127.0.0.1:27017/"
var cors = require("cors");
app.use(cors());

app.get('/alldata', (req, res) => {
    mc.connect(url, (err, db) => {
        if (err) throw err
        var dbo = db.db("information");
        dbo.collection('data').find({}).toArray((err, res1) => {
            res.json({ data: res1 });
            db.close()
        })
    })
})



app.get('/filter/:order', (req, res) => {
    let order = req.params.order
    mc.connect(url, (err, db) => {
        if (err) throw err
        var dbo = db.db("information");
        dbo.collection('data').find({}).sort({ age: order }).toArray((err, res1) => {
            res.json({ data: res1 });
            db.close()
        })
    })
})


app.get("/searchfun", (req, res) => {

    var name = req.query["t1"]
    // console.log("roll number:",rno1)
    mc.connect(url, (err, db) => {
        if (err) throw err
        var dbo = db.db("information")
        dbo.collection("data").find({ sname: name }).toArray((err, res1) => {
            if (err) throw err
            var trows = res1.length;
            console.log("result response:", res1)
            console.log("total records:", trows)
           
            if (trows > 0) {
                var ans = "<table border='2'><tr><th>Name</th><th>Age</th><th>Address</th></tr>"
                for (var i = 0; i < trows; i++) {
                    ans = ans + "<tr><td>" + res1[i]['sname'] + "</td><td>" + res1[i]['age'] + "</td><td>" + res1[i]['address'] + "</td></tr>"
                }
                ans = ans + "</table>"
                res.send(ans)
            }
            else {
                res.send("<h1><center>No Records in DB or check roll number</center></h1>")
            }
            db.close()
        })

    })
})



var server = app.listen(2345, function () {
    var port = server.address().port
    console.log("app listening.........%d ", port)
})

