const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,  // Ensures a rating is always provided
    },
    createdAt: {
        type: Date,
        default: Date.now, // Fixed the issue
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

});

module.exports = mongoose.model("Review", reviewSchema);
