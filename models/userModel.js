const mongooseVar = require('mongoose');
const validator = require('validator');
const userSchema = new mongooseVar.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: validator.isEmail

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Length should be greater than 6 characters"],
        select: true
    },

    location: {
        type: String,
        default: "pakistan"
    }

},
    { timestamps: true }
);
const userModel = mongooseVar.model("user", userSchema);
module.exports = userModel;
