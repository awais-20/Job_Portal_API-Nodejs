const usermodel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const hash = require('hash');
const jwt = require('jsonwebtoken');


async function GenerateToken(user) {
    return token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
}
async function userregister(req, resp, next) {

    try {

        const { name, email, password, Cpassword, location } = req.body;
        if (!name || !email || !password || !Cpassword) {

            return next('Please Provide the mandatory Field');
        }
        const existingemail = await usermodel.findOne({ email });
        if (existingemail) {
            return next("User with this email already exists.");
        }
        if (password != Cpassword) {
            return next(new Error("Password and confirm password do not match."));
        }

        const securepassword = await bcrypt.hash(password, 10);

        const data = new usermodel({
            name,
            email,
            password: securepassword,
            location
        });
        await data.save();
        return resp.status(200).send({
            success: true,
            message: "User Registered Successfully",
            data: {
                name: data.name,
                email: data.email,
                location: data.location
            }
        });

    }
    catch (error) {
        return next(error);
    }
}

async function login(req, resp, next) {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return next('Enter email or password');
        }
        const user = await usermodel.findOne({ email })
        if (!user) {
            return next('Invalid Username or Password');
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next('Invalid Username or Password');
        }
        user.password = undefined;
        const token = await GenerateToken(user);
        return resp.status(200).send({
            success: true,
            message: "user signed in successfully",
            token,
            user
        });
        // console.log(result);
    } catch (error) {
        return next(`Internal server error: ${error.message}`);
    }

}

module.exports = {
    userregister,
    login
}     