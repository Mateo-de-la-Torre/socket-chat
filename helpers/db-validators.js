const Category = require('../models/category');
const Product = require('../models/product');
const Role = require('../models/role');
const User = require('../models/user');


const isRoleValidate = async(rol = '') => {
    const existRol = await Role.findOne({ rol });
    if (!existRol) {
        throw new Error(`El rol ${rol} no esta registrado en la DB`);
    }
}

const existEmail = async (email = '') => {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
        throw new Error(`El email ${ email } ya esta registrado`);
    }
}


const existID = async (id) => {
    const existID = await User.findById( id );
    if (!existID) {
        throw new Error(`No existe un usuario con el id: ${ id } `);
    }
}

const existeCategoriaID = async (id) => {
    const existeCategoria = await Category.findById( id );
    if (!existeCategoria) {
        throw new Error(`No existe una categoria con el id: ${ id } `);
    }
}


const existeProductoID = async (id) => {
    const existeProducto = await Product.findById( id );
    if (!existeProducto) {
        throw new Error(`No existe un producto con el id: ${ id } `);
    }
}



const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion}, no es permitida. Las permitidas son ${colecciones}`);
    }
    return true;
}







module.exports = {
    isRoleValidate,
    existEmail,
    existID,
    existeCategoriaID,
    existeProductoID,
    coleccionesPermitidas
}