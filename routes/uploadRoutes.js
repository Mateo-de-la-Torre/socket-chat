const {Router} = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploadController');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const uploadRoutes = Router();

uploadRoutes.post('/', cargarArchivos);

uploadRoutes.put('/:coleccion/:id', [
    check('id', 'No es un id  de Mongo valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, [ 'users', 'products' ] )),
    validarCampos
], actualizarImagenCloudinary);
// actualizarImagen);

uploadRoutes.get('/:coleccion/:id', [
    check('id', 'No es un id  de Mongo valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, [ 'users', 'products' ] )),
    validarCampos
], mostrarImagen)

module.exports = uploadRoutes

