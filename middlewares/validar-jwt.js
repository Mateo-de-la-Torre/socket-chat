const jwt = require("jsonwebtoken");
const User = require('../models/user');

const validarJWT = async (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(400).send({message: 'Se necesita token para esta peticion'})
    }

    try {
        
        const {id} =  jwt.verify( token, process.env.SECRET_KEY)

        const user = await User.findOne({ _id: id });
        

        if (!user) {
            return res.status(401).json({ message: 'Token no valido - Usuario no existe en BD' });
        }

        if (!user.estado) {
            return res.status(401).json({ message: 'Token no valido - Usuario con estado en false' });
        }

        // if (user.rol !== 'USER_ADMIN') {
        //     return res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de administrador' });
        // }
      
        req.user = user; // ponemos en la request el JSON del usuario

        next();

    } catch (error) {
        console.log(error)
        res.status(402).send({message: 'Token no valido'})
    }

}


module.exports = {
    validarJWT,
}