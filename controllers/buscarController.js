const { response } = require('express');
const {ObjectId } = require('mongoose').Types
const User = require('../models/user');
const Category = require('../models/category');
const Product = require("../models/product");


const coleccionesPermitidas = [
    'users',
    'categories',
    'products',
    'rols'
]


const buscarUsers = async( termino = '', res = response) => {
    
    const isMongoID = ObjectId.isValid( termino ); // comprueba que lo q le mandan en el termino sea un id de mongo


    if (isMongoID) { // si es un id, busca al usuario con ese id
        const user = await User.findById(termino)
        return res.json({
            results: ( user ) ? [ user ] : [] // si esxiste el usuario mando un array con el usuario, sino manda un array vacio
        })
    }

    const regex = new RegExp( termino, 'i'); // exprecion regular para q no tenga en cuenta las mayusculas o minusculas 

    const user = await User.find({ 
        $or: [{ name: regex }, { email: regex } ], // buscarlo por name o por email
        $and: [{ estado: true }] // solo busca a los q tiene el esatdo en true
    }) 

    res.json({
        results: user
    })
}


const buscarCategories = async( termino = '', res = response) => {
    
    const isMongoID = ObjectId.isValid( termino ); 


    if (isMongoID) { 
        const category = await Category.findById(termino)
        return res.json({
            results: ( category ) ? [ category ] : [] 
        })
    }

    const regex = new RegExp( termino, 'i'); 

    const category = await Category.find({ name: regex, estado: true }) 

    res.json({
        results: category
    })
}

const buscarProducts = async( termino = '', res = response) => {
    
    const isMongoID = ObjectId.isValid( termino ); 


    if (isMongoID) { 
        const product = await Product.findById(termino).populate('category', 'name')
        return res.json({
            results: ( product ) ? [ product ] : [] 
        })
    }

    const regex = new RegExp( termino, 'i'); 

    const product = await Product.find({ name: regex, estado: true }) .populate('category', 'name')

    res.json({
        results: product
    })
}





const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;


    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).send({message: `Las colecciones permitidas son: ${coleccionesPermitidas}`})
    }


    switch (coleccion) {
        case 'users':
            buscarUsers(termino, res)
        break;
    
        case 'categories':
            buscarCategories(termino, res)
        break;

        case 'products':
            buscarProducts(termino, res)
        break;

        default:
            res.status(500).json({message: 'Se me olvido hacer esta busqueda'})
            break;
    }
}



module.exports = {
    buscar
}