const {Schema, model} = require('mongoose');


const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El name es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    user: { // que usuario creo la categoria
        type: Schema.Types.ObjectId, // otro objecto en mongo
        ref: 'User',
        required: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
    },

})


ProductSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();
    return data;
}


module.exports = model( 'Product', ProductSchema );