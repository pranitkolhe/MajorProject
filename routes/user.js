const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectURL } = require("../middelware.js");
const Usercontrollers = require("../controllers/users.js")


router.route("/signup")
.get(Usercontrollers.renderSignupForm)
.post(wrapAsync(Usercontrollers.signup));

router.route("/login")
.get(Usercontrollers.renderLoginForm)
.post(saveRedirectURL,passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}), Usercontrollers.login);

router.get("/logout",Usercontrollers.logout);


module.exports = router;