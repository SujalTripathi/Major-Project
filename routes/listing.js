const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing))
    ;

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// Category filter route
router.get("/category/:category", async (req, res) => {
    try {
        let category = req.params.category;
        console.log("Category Requested:", category); // Debugging

        let filteredListings = await Listing.find({ category: category });

        if (!filteredListings.length) {
            console.log("No listings found for this category");
            return res.status(404).send("No listings found in this category");
        }

        console.log("Listings found:", filteredListings);
        res.render("listings/index", { allListings: filteredListings });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;