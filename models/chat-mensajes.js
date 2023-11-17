
// Función para crear un mensaje
const crearMensaje = (uid, nombre, mensaje) => ({
    uid,
    nombre,
    mensaje
});


// Función para el chat de mensajes
const ChatMensajes = () => {
    const mensajes = [];
    const users = {};

    // Función para obtener los últimos 10 mensajes
    const ultimos10 = () => {
        return mensajes.slice(-10);
    };

    // Función para obtener los usuarios como un array
    const usuariosArr = () => Object.values(users); // [ {}, {}, {}]

    // Función para enviar un mensaje
    const enviarMensaje = (uid, nombre, mensaje) => {
        mensajes.push(crearMensaje(uid, nombre, mensaje)); // agrega el mensaje al final del array

        if (mensajes.length > 10) { // si hay mas de 10 elementos en el array
            mensajes.shift(); // elimina el primero que ingreso
        }
    };

    // Función para conectar un usuario
    const conectarUsuario = (user) => {
        users[user.id] = user;
    };

    // Función para desconectar un usuario
    const desconectarUsuario = (id) => {
        delete users[id];
    };

    // Devolver las funciones que queremos exponer
    return {
        ultimos10,
        usuariosArr,
        enviarMensaje,
        conectarUsuario,
        desconectarUsuario
    };
};

module.exports = ChatMensajes;