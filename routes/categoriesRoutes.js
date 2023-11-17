const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, isAdminRole } = require('../middlewares');
const { getCategories, postCategories, getCategoryID, putCategories, deleteCategories } = require('../controllers/categoriesController');
const { existeCategoriaID } = require('../helpers/db-validators');



const categoriesRoutes = Router();

categoriesRoutes.get('/', getCategories);

categoriesRoutes.get('/:id',[
    check('id', 'No es un id  de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaID),
    validarCampos,
], getCategoryID);

categoriesRoutes.post('/', [
    validarJWT,
    check('name', 'El name es obligatorio').not().isEmpty(),
    validarCampos
], postCategories);

categoriesRoutes.put('/:id', [
    validarJWT,
    check('name', 'El name es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaID),
    validarCampos,
], putCategories);

categoriesRoutes.delete('/:id',[
    validarJWT,
    isAdminRole,
    check('id', 'No es un id  de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaID),
    validarCampos,
], deleteCategories);









module.exports = categoriesRoutes