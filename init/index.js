const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../modules/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj, owner: "67d08d4c0dfb201f3b6d8036"}))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};


initDB();


// brew services start mongodb-community