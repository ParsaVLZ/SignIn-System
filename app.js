const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const { default: mongoose } = require("mongoose");
const AllRouters = require("./routes/index");
const flash = require("express-flash");
const session = require("express-session");
const {passportInit} = require("./passport.config");
const passport = require("passport")
const { notFoundError, errorHandler } = require("./error-handling");
const app = express();
mongoose.connect("mongodb://localhost:27017/passport-js", {}).then(() => {
    console.log("Connected to MongoDB");
})

// Setup app
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(flash());
// Setup view engine and Layout
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layout/main.ejs");
// Set up session
app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false
}))
// Set up Passport
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());
// Routers
app.use(AllRouters(passport));
app.use(notFoundError);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;

// Set up express server
app.listen(PORT, () => {
    console.log(`Listening to on port ${PORT}`);
});