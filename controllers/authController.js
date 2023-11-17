const User = require('../models/user');
const bcrypt = require('bcrypt');
const { response } = require('express');
const jwt = require("jsonwebtoken");
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        
        const usuario = await User.findOne({email});
        
        // Verificar si el email existe
        if (!usuario) {
            return res.status(400).send({message: 'El email o el password son incorrectos'})
        }

        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).send({message: 'El email o el password son incorrectos -estado en false'})
        }

        const validPassword = await bcrypt.compare(password, usuario.password);

        if (!validPassword) {
            return res.status(400).send({message: 'El password es incorrecto'})
        } 
       
        const {id, name, rol, image } = usuario

        const data = {
            id: id,
            email: email,
            name: name,
            rol: rol,
            image: image,
        }
        const token = jwt.sign(data, process.env.SECRET_KEY, {
            expiresIn: '10000h',
        });


        res.json({
            usuario: {
                id,
                email,
                name,
                rol,
                image,
                token
            }
        })
        

    } catch (error) {
        console.log(error);
        return res.status(500).send('hable con el administrador')
    }
};






const googleSingIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { name, email, image } = await googleVerify(id_token);
        
        let usuario = await User.findOne({ email });

        if (!usuario) {
            // Si no existe, hay que crearlo
            const data = {
                name,
                email,
                password: 'abc123',
                image, 
                google: true,
                rol: 'USER_ROLE' // Define el campo rol según tus necesidades
            }
            usuario = new User(data);
            await usuario.save();
        }

        if (!usuario.estado) {
            return res.status(400).send({ message: 'Hable con el administrador, usuario bloqueado' });
        }

        // Genera el token con la información correcta
        const token = jwt.sign({ id: usuario._id, name: usuario.name, email: usuario.email }, process.env.SECRET_KEY, {
            expiresIn: '10000h',
        });

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'El token no se pudo verificar' });
    }
}


const renovarToken = (req, res) => { // cuando el usuario inicia sesion se renueva el token

    const { id, email, name, rol, image } = req.user;

    const user = {
        id: id,
        email: email,
        name: name,
        rol: rol,
        image: image,
    }
    const token = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: '10000h',
    });

    res.json({
        user,
        token
    })
};







module.exports = {
    login,
    googleSingIn,
    renovarToken
}