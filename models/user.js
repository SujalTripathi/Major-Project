const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// Apply the passportLocalMongoose plugin to the schema
UserSchema.plugin(passportLocalMongoose);

// Define and export the User model
module.exports = mongoose.model("User", UserSchema);
