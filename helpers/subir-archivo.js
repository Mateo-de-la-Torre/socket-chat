const path = require('path');
const { v4: uuidv4 } = require ('uuid');


const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = "" ) => {

    return new Promise( (resolve, reject) => {
        
        const { archivo } = files; // recibo directamente el files sin la req

        const nombreCortado = archivo.name.split('.'); // dividimos el nombre de la extencion (jpg)

        const extension = nombreCortado[nombreCortado.length - 1]; // (jpg, txt, png ...)


        // Validar la extension
        if (!extensionesValidas.includes( extension )) {
            return reject(`No se pemite una imagen de tipo: ${extension}, solo se permiten imagenes de tipo ${extensionesValidas}`)  
        }

        const nombreUnico = uuidv4() + '.' + extension; // para crearle un nombre unico a cada imagen

        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreUnico) // la carpeta donde quiero mover el archivo, con el nombre del archivo

        archivo.mv(uploadPath, (err) => { // funcion para mover el ARCHIVO a uploadPath.
            if (err) {
                reject(err)
            }

            resolve(nombreUnico);
        });
    })
};



module.exports = {
    subirArchivo
}