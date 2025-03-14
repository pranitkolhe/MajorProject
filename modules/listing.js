const mongoose = require("mongoose");
const Review = require("./review");  // Ensure this file exports the Review model
const User = require("./user");
const { string } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,  // Fixed typo
    },
    description: String,
    image: {
      url:String,
      filename:String,
    },
    price: {
        type: Number,
        required: true,  // Ensure a listing always has a price
        min: 0,  // Prevent negative prices
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",  // Ensure "Review" matches the model name in review.js
        },
    ],
    owner: {
       type: Schema.Types.ObjectId,
       ref: "User",
    }

});

    listingSchema.post("findOneAndDelete",async(listings)=>{
        if(listings){
        await Review.deleteMany({_id :{ $in: listings.reviews}})
        }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
