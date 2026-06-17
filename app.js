if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErrors = require("./utils/ExpressErrors.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const rawDbUrl = (
    process.env.ATLASDB_URL ||
    process.env.MONGO_URL ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    ""
).trim();
const dbUrl = rawDbUrl.replace(/^(["'])(.*)\1$/, "$2");
const port = process.env.PORT || 8080;

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", port);
console.log("DB URL is set:", Boolean(dbUrl));
if (dbUrl) {
    console.log("DB URL preview:", dbUrl.replace(/:[^:@]*@/, ":****@"));
}

app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("__method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    if (!dbUrl || !/^mongodb(?:\+srv)?:\/\//i.test(dbUrl)) {
        throw new Error(
            "Invalid MongoDB connection string. Please set ATLASDB_URL (or MONGO_URL/MONGODB_URI) to a valid mongodb:// or mongodb+srv:// URL."
        );
    }

    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 15000,
    });
    console.log("connected to DB");

    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret: process.env.SECRET || "default-secret",
        },
        touchAfter: 24 * 3600,
    });

    store.on("error", (err) => {
        console.log("ERROR in MONGO SESSION STORE", err);
    });

    const sessionOption = {
        store,
        secret: process.env.SECRET || "default-secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        },
    };

    app.use(session(sessionOption));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
        next();
    });

    app.get("/", (req, res) => {
        res.redirect("/listings");
    });

    app.get("/listing", (req, res) => {
        res.redirect("/listings");
    });

    app.get("/listing/:id", (req, res) => {
        res.redirect(`/listings/${req.params.id}`);
    });

    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    app.all("*", (req, res, next) => {
        next(new ExpressErrors(404, "Page Not Found"));
    });

    app.use((err, req, res, next) => {
        const { statusCode = 500, message = "Somethig Went Wrong!!" } = err;
        res.status(statusCode).render("error.ejs", { message });
    });

    app.listen(port, () => {
        console.log(`listning on port ${port}`);
        console.log(`http://localhost:${port}`);
    });
}

main().catch((err) => {
    console.error("Failed to start app:", err);
    process.exit(1);
});
