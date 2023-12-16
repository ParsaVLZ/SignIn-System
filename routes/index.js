const { hashSync } = require("bcrypt");
const { userModel } = require("../model/user.model");
const { redirectIfIsAuth, checKAuthentication } = require("../middleware");

const router = require("express").Router();
function initRoutes(passport){
    router.get("/", (req, res) =>{
        res.render("index.ejs", {title: "Home"} )
    } )
    router.get("/login",redirectIfIsAuth, (req, res) =>{
        res.render("login.ejs", {title: "Login"} )
    } )
    router.get("/register", redirectIfIsAuth, (req, res) =>{
        res.render("register.ejs", {title: "Register"} )
    } )
    router.get("/profile", checKAuthentication, (req, res) =>{
        const user =  req.user;
        res.render("profile.ejs", {title: "Profile", user});
    } )
    router.get("/logout", checKAuthentication, (req, res) =>{
        req.logOut({keepSessionInfo: false}, (err) => {
            if (err) {
                console.log(err);
            }
        })
         res.redirect("/login");
    } )
    router.post("/register", redirectIfIsAuth, async (req, res) => {
        try {
            const {fullname: fullName, username, password} = req.body;
            const hashPassword = hashSync(password, 10);
            const user = await userModel.findOne({username});
            if(user){
                const referrer = req?.header('Referrer') ?? req.headers.referer;
                req.flash("error", "This username already exists!");
                return res.redirect(referrer ?? "/register");
            }
            await userModel.create({
                fullName,
                username,
                password: hashPassword
            })
            res.redirect("/login")
        } catch (error) {
            next(error);
        }
    })
    router.post("/login", redirectIfIsAuth, passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true
    }), async(req, res) => {
        res.redirect("/profile")
    })
    return router;
}

module.exports = initRoutes;