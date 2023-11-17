const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/combrobar-jwt");
const ChatMensajes = require("../models/chat-mensajes");

const chatMensajes = ChatMensajes();

const socketController = async( socket = new Socket(), io ) => {

    const token = socket.handshake.headers['x-token']; // traemos el token del localStorage
    const user = await comprobarJWT(token)

    if (!user) {
        return socket.disconnect(); // desconecta el socket del servidor
    }

    // Agregar el usuario conectado a la lista de usaurios conectados
    chatMensajes.conectarUsuario( user );
    io.emit('usuarios-activos', chatMensajes.usuariosArr()); // mostramos los usuarios activos a todos los usuarios
    
    socket.emit('recibir-mesajes', chatMensajes.ultimos10()); // para que cuando los usuarios se conecten puedan ver los ultimos 10 mensajes

    // Conectarlo a una sala especial
    socket.join( user.id );


    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( user.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr()); // Lo sacamos de la lista de usuarios conectados
    });


    // Enviamos mensaje
    socket.on( 'enviar-mensaje', ({id, mensaje}) => {

        if (id) { // Mensaje Privado
            
            socket.to( id ).emit('mesaje-privado', { De: user.name, mensaje }); // le manda el mensaje al usuer con ese id

        } else {
            chatMensajes.enviarMensaje(user.id, user.name, mensaje);
            io.emit('recibir-mesajes', chatMensajes.ultimos10()); // mustra los ultimos 10 mensajes a todos
        }

    })
};


module.exports = {
    socketController
}