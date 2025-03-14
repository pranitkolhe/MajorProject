const Listing = require("../modules/listing");

module.exports.index = async (req,res)=>{
        const allListings = await Listing.find({}); 
        res.render("listings/index.ejs", { allListings } );
        // console.log(allListings);
}

module.exports.renderNewForm = (req,res)=>{
        res.render("listings/new.ejs");
}

module.exports.createListing = async( req, res, next)=>{
    // let listing = {title,descreption,image,price,country,location} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    // console.log(url,"...",filename);
    newListing.image = { url,filename };
    await newListing.save();
    req.flash("success", "New Created listing");
    res.redirect("/listings");
    // let listing = req.body.listing;
    // console.log(listing);
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{ listing });
}

module.exports.renderEditListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    originalImage.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs",{ listing,originalImage });
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing });

    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename};
    await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Listing");
    res.redirect("/listings");
}