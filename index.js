const express = require("express")
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")

//Initialize the ENV File
dotenv.config()

//Connet To mongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connected");
    }) 
    .catch((error) => {
        console.log(error);
    })

//Parse JSON
app.use(express.json())

//Routes
app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/", (req,res) => {
    res.send("hi")
})


//APP IS LISTENING
const port = process.env.PORT;
app.listen(port || 6000, () => {
    console.log(`Server run at http://localhost: ${port}`);
})