const express= require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const path = require('path');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

async function main() {
  mongoose.connect("mongodb://localhost:27017/Pizza")
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.error('Could not connect to MongoDB', err);
    });
}
main();

let port = 3000;

app.get('/pizza',(req,res)=>{
    res.render('pizza.ejs');
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})


