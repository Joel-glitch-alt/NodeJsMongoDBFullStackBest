const jwt = require('jsonwebtoken');
const User = require('../models/user'); 


const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt
//
if (token) {
   jwt.verify(token,'Joel Addition Global', (err,decodeToken)=>{
    //req.user = jwt.decode(token, 'Joel Addition Global')
    if (err) {
       console.log(err.message )
        res.redirect('/login');
    } else {
        console.log(decodeToken);
        next();
    }
   }) 
} else {
    res.redirect('/login');
}
}


//Check current user....
const checkuser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'Joel Addition Global', async (err, decodedToken) => {
            if (err) {
                console.log('JWT verification error:', err.message);
                res.locals.user = null;
                next();
            } else {
                try {
                    // Fetch user using the decoded token's id
                    const user = await User.findById(decodedToken.id);
                    if (user) {
                        res.locals.user = { Username: user.username }; 
                    } else {
                        res.locals.user = null;
                    }
                    next();
                } catch (error) {
                    console.error('Error fetching user:', error.message);
                    res.locals.user = null;
                    next();
                }
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};
module.exports = {requireAuth, checkuser};