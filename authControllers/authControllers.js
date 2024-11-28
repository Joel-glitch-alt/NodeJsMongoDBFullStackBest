const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Handling Errors
const handleErrors = (error) => {
    console.log(error.message, error.code);
    let errors = {username:"", email: "", password: "" };
    //Incorrect  Email
    if (error.message === "Incorrect email") {
        errors.email = "The email is not registered!!";
    }
    if (error.message === "Incorrect password") {
        errors.password = "The password is not correct!!";
    }

    // Duplicate Key Error
    if (error.code === 11000) {
        errors.email = "Email already registered";
        return errors;
    }

    // Validation Error
    if (error.message.includes('User validation failed')) {
        Object.values(error.errors).forEach(({ properties }) => {
            console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'Joel Addition Global',{
        expiresIn: maxAge
    });
}


//API Routes....
const signUp_get = (req, res, next) => {
    res.render("signUp");
};


//Login API-GET.....
const login_get = (req, res, next) => {
    res.render("login");
};

// Sign-Up POST
const signUp_post = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ username, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        
        // Send success response with redirect URL
        res.status(201).json({ user: user._id, redirect: '/header' });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};


// Log-In POST
// const logIn_post = async (req, res, next) => {
//     const { email, password, username } = req.body;
//     console.log(email)
//     try {
//         // Attempt to login the user using the provided credentials
//         const user = await User.login(username, email, password);
//         //
//         const token = createToken(user._id);
//         res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
//         // If user found, return user ID (or any other relevant user details)
//         res.status(200).json({ user: user._id }); 
//     } 
//     catch (error) {
//         const errors= handleErrors(error);
//         console.error(error); 
//         res.status(400).json({ errors});
//     }
// };
const logIn_post = async (req, res, next) => {
    const { username, email, password } = req.body;
    console.log("Login attempt with:", { username, email, password });

    try {
        const user = await User.login(username, email, password); 
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        console.error("Login error:", error.message); 
        res.status(400).json({ errors });
    }
};


//LogOut 
    const logout_get = (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 }); 
        res.redirect('/login'); 
    };
    


module.exports = {
    signUp_get,
    login_get,
    signUp_post,
    logIn_post,
    logout_get
};
