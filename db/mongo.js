const mongoose = require("mongoose")
let uri
// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV == "production") {
    uri = "mongodb+srv://nut345:nut345@cluster0.qlph3.mongodb.net/test"
} else {
    uri = "mongodb+srv://nut345:nut345@cluster0.qlph3.mongodb.net/test"
}

mongoose.connect(uri)

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => console.log("database ok"))

module.exports = db
