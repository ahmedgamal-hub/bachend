const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "All Fields Are Required" })
    }
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
        return res.status(401).json({ message: "User Already Exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
    });
    const accessToken = jwt.sign({
        UserInfo: {
            id: user._id
        },
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
    const refreshToken = jwt.sign({
        UserInfo: {
            id: user._id
        },
    }, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,

    })
    res.json({ accessToken, emai: user.email, first_name: user.first_name, last_name: user.last_name })
};
const login = async(req, res)=>{
    
    const {  email, password } = req.body;
    if ( !email || !password) {
        return res.status(400).json({ message: "All Fields Are Required" })
    }
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
        return res.status(401).json({ message: "User Does Not Exist" })
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        return res.status(401).json({ message: "Wrong Password" })
    }
 
    const accessToken = jwt.sign({
        UserInfo: {
            id: foundUser._id
        },
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
    const refreshToken = jwt.sign({
        UserInfo: {
            id: foundUser._id
        },
    }, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,

    })
    res.json({ accessToken, emai: foundUser.email })
}
module.exports={
    register,
    login,
}