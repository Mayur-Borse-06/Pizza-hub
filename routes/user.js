const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
})

router.post("/signup", async(req, res) => {
    let {fullName, username, email, password} = req.body;
    const newUser = new User({
        fullName: fullName,
        username: username,
        email: email,
        role: "customer",
    })
    const registeredUser = await User.register(newUser, password);
    req.logIn(registeredUser, (err) => {
        if(err) {
            return next(err);
        }
        res.redirect("/pizza");
    })
})

router.get("/login", (req, res) => {
    res.render("user/login.ejs");
})

router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
    }),
    (req, res) => {
        res.redirect("/pizza");
    }
)

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        res.redirect("/pizza");
    })
})


module.exports = router;