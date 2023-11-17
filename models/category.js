const {Schema, model} = require('mongoose');


const CategorySchema = Schema({
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
    }
})


CategorySchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();
    return data;
}


module.exports = model( 'Category', CategorySchema );