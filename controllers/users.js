const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
  };

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    // Check if email already exists in the database
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      // If email already exists, send an error message
      req.flash("error", "Email is already registered!");
      return res.redirect("/signup"); // Redirect to signup page
    }
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    //Bhai ese hi sari websites banti hai toh isilye agar kabhi bhi tujhe kuch bhi banana ho apni website ke liye toh poora project analys karna 

    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }

};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you are logged out!");
      res.redirect("/listings");
    });
  }