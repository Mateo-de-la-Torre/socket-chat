

const validarCampos  = require('../middlewares/validar-campos');
const validarJWT  = require('../middlewares/validar-jwt');
const isAdminRole  = require('../middlewares/validar-isAdmin');


module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...isAdminRole
}