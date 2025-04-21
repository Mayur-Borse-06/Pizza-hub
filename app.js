const express= require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const path = require('path');
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

app.use("/", userRoutes);

app.get('/pizza', async (req, res) => {
    const pizzas = await Pizza.find({});
    res.render('pizza.ejs', { pizzas }); // <-- pass as 'pizzas'
});
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
app
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})


