const User = require("../modules/user");

module.exports.renderSignupForm = (req,res)=>{ 
    res.render("users/signup.ejs")
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};


module.exports.signup = async(req,res)=>{
    try{
        const { username,email,password } = req.body;
        const newUser = new User({email,username});
        
        const registerUser = await User.register(newUser,password);
        console.log(registerUser);
        req.flash("success","Welcome to wonderlust"); 
        res.redirect("/listings");
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wonderlust!!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logOut successfully");
        res.redirect("/listings");
    });
};