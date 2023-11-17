const {Router} = require('express');
const { check } = require('express-validator');
const { login, googleSingIn, renovarToken } = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt')

const authRoutes = Router();


authRoutes.post('/login',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login)


authRoutes.post('/google',[
    check('id_token', 'id_token de google es necesario').not().isEmpty(),
    validarCampos
], googleSingIn)


authRoutes.get('/', validarJWT, renovarToken); // ruta para cuando el usuario inicie sesion se le valide el token y se le renueva


module.exports = authRoutes

