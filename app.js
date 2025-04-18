const express= require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const path = require('path');
const session = require('express-session');

const Pizza = require('./models/pizza.js');

const userRoutes = require("./routes/user");

const port = 3000;


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

//Express session

const sessionOptions = {
  secret: "secretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
  }
}

app.use(session(sessionOptions));

app.use("/", userRoutes);

app.get('/pizza',(req,res)=>{
    res.render('pizza.ejs');
})
app.get("/pizza/new",(req,res)=>{
  res.render("new.ejs");
})
app.post("/pizza",async(req,res)=>{
  const { name, price, image, description, category, size } = req.body;
  const pizza = new Pizza({
    name:name,
    price : price,
    image: image,
    description : description,
    category : category,
    size: size,
  });
  await pizza.save();
  res.redirect("/pizza");
})

//show route
app.get("/pizza/:id",async(req,res)=>{
  const pizza = await Pizza.findById(req.params.id);
  res.render("show.ejs",{pizza});
})
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})


