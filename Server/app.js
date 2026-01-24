const express = require("express")
const mongoose = require("mongoose")
const app = express();

const cors = require('cors')
const bodyParser = require('body-parser');
const dataRoute = require("./router/dataRouter")




mongoose.connect('mongodb://127.0.0.1:27017/blackcoffer').then(()=>{
    console.log("database connection succssefully");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});




app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/data' , dataRoute)




app.listen(8080, ()=>{
    console.log("app is listen port 8080")
})