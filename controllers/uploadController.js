const Product = require("../models/product");
const User = require('../models/user');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const { subirArchivo } = require("../helpers/subir-archivo");


// Para subir archivos - imagenes, a una carpleta local llamada 'ArcvivosLocales' dentro de uploads
const cargarArchivos = async(req, res) => {

    //Podria ir en un Midleware
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) { // por si no loe mandamos ningun archivo
        res.status(400).json({msg: 'No hay archivos que subir'});
        return;
    }

    try {
        //   const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' ) // el array de la segunda posicion pisa al extensionesValidas de subir-archivos y carpeta = textos 
        const nombre = await subirArchivo( req.files, undefined, 'arcvivosLocales' ) // undefined para mandar el argumento por defecto
        res.json({ nombre })

    } catch (msg) {
            res.status(400).json( msg );
    }

}




// Ponerle o cambiarle una imagen a un usuario o a un producto y que se guarde en una carpeta local llamada 'users' o 'products' dentro de uploads
const actualizarImagen = async(req, res) => {

    //Podria ir en un Midleware
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) { // por si no loe mandamos ningun archivo
        res.status(400).json({msg: 'No hay archivos que subir'});
        return;
    }
    
    const { coleccion, id } = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'users':
            
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un usuario con el id: ${id}`})
            }

        break;

        case 'products':
            
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un producto con el id: ${id}`})
            }

        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'})
    }

    //Limpiar imagenes previas (cuando actualiza la imagen, se elimina la anterior que tenia)

    if (modelo.image) { // si la imagen existe en el modelo
       
        // Hay q borrar las imagenes del servidor
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.image) // vamos hasta la carpeta uploads, vemos cual coleccion es y el nombre de la imagen
        
        if (fs.existsSync(pathImage)) { // si existe el archivo
            fs.unlinkSync(pathImage); // se borra
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.image = nombre;

    await modelo.save();

    res.json(modelo);
};




// // Ponerle o cambiarle una imagen a un usuario o a un producto y que se guarde en cloudinary 
const actualizarImagenCloudinary = async(req, res) => {

    //Podria ir en un Midleware
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) { // por si no loe mandamos ningun archivo
        res.status(400).json({msg: 'No hay archivos que subir'});
        return;
    }
    
    const { coleccion, id } = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'users':
            
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un usuario con el id: ${id}`})
            }

        break;

        case 'products':
            
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un producto con el id: ${id}`})
            }

        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'})
    }

    //Limpiar imagenes previas (cuando actualiza la imagen, se elimina la anterior que tenia)

    if (modelo.image) { 
        const nombreArr = modelo.image.split('/');  // cortamos el nombre completo para obtener el nombre de la imagen
        const nombre = nombreArr[nombreArr.length -1] // agarramos la ultima posicion (contiene el nombre)
        const [ public_id ] = nombre.split('.') // le sacamos el (.jpg)

        cloudinary.uploader.destroy(public_id) //lo eliminamos de cloudinary usando una funcion propia
    }
    

    const { tempFilePath } = req.files.archivo; // path temporal que viene por default
    const {secure_url} = await cloudinary.uploader.upload( tempFilePath ); // subimos la imagen a cloudinary

    // const nombre = await subirArchivo( req.files, undefined, coleccion );
    modelo.image = secure_url;

    await modelo.save(); // se guarda el modelo en la BD con la imagen de cloudinary

    res.json(modelo);
};




// Endpoint para mostrar la imagen de algun usuario o producto
const mostrarImagen = async(req, res) => {
    
    const { coleccion, id } = req.params;
    
    let modelo;

    switch (coleccion) {
        case 'users':
            
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un usuario con el id: ${id}`})
            }

        break;

        case 'products':
            
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({msg: `No existe un producto con el id: ${id}`})
            }

        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'})
    }

    //Limpiar imagenes previas (cuando actualiza la imagen, se elimina la anterior que tenia)

    if (modelo.image) { // si la imagen existe en el modelo
       
        // Hay q borrar las imagenes del servidor
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.image) // vamos hasta la carpeta uploads, vemos cual coleccion es y el nombre de la imagen
        
        if (fs.existsSync(pathImage)) { // si existe el archivo
            return res.sendFile( pathImage )
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg', )
    res.sendFile(pathImagen)
}




module.exports = {
    cargarArchivos,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}