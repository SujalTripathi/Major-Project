const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

// NOTE: Sample data import has been REMOVED

// Main listings route - ONLY shows database listings
router.route("/")
    .get(wrapAsync(async (req, res) => {
        const dbListings = await Listing.find({});
        res.render("listings/index", { allListings: dbListings });
    }))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Single listing operations
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// Edit form
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.renderEditForm)
);

// Category filter - ONLY shows database listings
router.get("/category/:category", wrapAsync(async (req, res) => {
    const category = req.params.category;
    const filteredListings = await Listing.find({ category });
    
    if (!filteredListings.length) {
        req.flash("error", "No listings found in this category");
        return res.redirect("/listings");
    }
    
    res.render("listings/index", { allListings: filteredListings });
}));

module.exports = router;