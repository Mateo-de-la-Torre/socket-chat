const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El name es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    image: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        enum: ['USER_ROLE', 'ADMIN_ROLE']
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
})


UsuarioSchema.methods.toJSON = function() {
    const {__v, password, _id ,...usuario} = this.toObject();
    usuario.id = _id;
    return usuario
}

module.exports = model( 'User', UsuarioSchema);