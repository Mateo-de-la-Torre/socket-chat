const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, isAdminRole } = require('../middlewares');
const { getProducts, getProductID, postProducts, putProduct, deleteProduct } = require('../controllers/productsController');
const { existeProductoID, existeCategoriaID } = require('../helpers/db-validators');



const productsRoutes = Router();


productsRoutes.get('/', getProducts);

productsRoutes.get('/:id',[
    check('id', 'No es un id  de Mongo valido').isMongoId(),
    check('id').custom(existeProductoID),
    validarCampos,
], getProductID);

productsRoutes.post('/',[
    validarJWT,
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('category', 'No es un id  de Mongo valido').isMongoId(),
    check('category').custom( existeCategoriaID),    
    validarCampos
], postProducts);

productsRoutes.put('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoID),
    validarCampos,
], putProduct);

productsRoutes.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id  de Mongo valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoID),
    validarCampos,
], deleteProduct);




module.exports = productsRoutes