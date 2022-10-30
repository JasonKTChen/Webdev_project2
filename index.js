const {MongoClient, Collection} = require("mongodb")
const bodyParser = require("body-parser")

const express = require("express")
const app = express()
app.listen(3000,()=>{
    console.log("listening on port 3000")
})
app.use(express.static(__dirname))
app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html") 
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))
const uri = "mongodb+srv://user:fmQivMoPHSFLKKqu@cluster0.lwe1xbp.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)
app.post("/signup",function(req, res){
    const name = req.body.name
    const password = req.body.password
    const data = {
        "name":name,
        "password":password
    }
    MongoClient.connect(uri, function(err, db){
        if (err) throw err
        const dbo = db.db("mydb")
        dbo.collection("Users").insertOne(data,function(err, res){
            if (err) throw err
            console.log("one document inserted")
            db.close()
        })
    })
    return res.redirect("/")
})

app.post("/login", function(req, res){
    const name = req.body.name
    const password = req.body.password
    const data = {
        "name":name,
        "password":password
    }
    MongoClient.connect(uri, function(err, db){
        if (err) throw err
        const dbo = db.db("mydb")
        dbo.collection("Users").findOne({name:name},function(err, foundUser){
            if (!err){
                if (foundUser){
                    if(foundUser.password === password){
                        res.send("Logged In")
                    }
                    else {
                        res.send("Invalid Password")
                    }
                }
                else {
                    res.send("Username Not Found")
                }
            }
            db.close()
        })
    })
    /*return res.redirect("/")*/
})


/*MongoClient.connect(uri, function(err, db){
    if (err) throw err
    const dbo = db.db("mydb")
    const myObject = {
        name:"Elliot", password:"pass123"
    }
    dbo.collection("Users").insertOne(myObject,function(err, res){
        if (err) throw err
        console.log("one document inserted")
        db.close()
    })
})*/


/*async function run(){
    try {
        const database = client.db("sample_mflix")
        const movies = database.collection("movies")
        const query = {title: "Back to the Future"}
        const movie = await movies.findOne(query)
        console.log(movie)
    }
    finally{
        await client.close()
    }
}
run().catch(console.dir)*/