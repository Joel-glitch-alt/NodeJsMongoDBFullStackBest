const mongoose = require('mongoose');
const { isEmail } = require("validator");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please ensure you enter password"],
        minlength: [8, "Minimum characters should be 8"],
        select: false
    },
    username: {
        type: String,
        required: false,
    }
});


//fire a function after Doc saved to DB...
// userSchema.post('save', function (doc, next) {
// console.log("New User saved",doc);
// next();
// });


userSchema.pre('save',async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})



//Static Method
// userSchema.statics.login = async function(email, password, username) {
//     const user = await this.findOne({ email });
//     if (user) {
//        const auth = await bcrypt.compare(password, user.password);
//        if (auth) {
//         return user;
//        }
//        throw Error('Incorrect password');
//     }
//     throw Error('incorrect email')
// }
// Updated login method signature
userSchema.statics.login = async function (username, email, password) {
    const user = await this.findOne({ 
        $or: [{ username }, { email }] 
    }).select('+password'); 

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error('Incorrect password');
    }
    throw new Error('Incorrect username or email');
};




// Creating our Model
const User = mongoose.model('joel', userSchema);

module.exports = User;
