const User = require('../models/user');
const jwt = require("jsonwebtoken");


const comprobarJWT = async( token = '') => {

    try {
        if (token.length < 10) { // verificamos q venga el token
            return null;
        }
        const {id} =  jwt.verify( token, process.env.SECRET_KEY);

        const user = await User.findOne({ _id: id });

        if (user) {
            return user
        } else{
            return null
        }


    } catch (error) {
        return null;
    }
}

module.exports = {
    comprobarJWT
}