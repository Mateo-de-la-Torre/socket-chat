const {Schema, model} = require('mongoose');


const RolSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El role es obligatorio']
    }
})


module.exports = model( 'Rols', RolSchema );