const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middelware.js")
const controllers = require("../controllers/reviews.js");

// Review 
// Post review route
router.post("/",isLoggedIn ,validateReview, wrapAsync(controllers.createReview));

// Delete Review

router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(controllers.deleteReview));


module.exports = router;