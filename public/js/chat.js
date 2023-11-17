const url = 'http://localhost:3001/api/auth';


//Referencias HTML

const txtUid = document.querySelector('#txtUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')


let usuario = null;
let socket = null;

// validar le token del localStorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html'; // reedirecciona al login
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;

    document.title = usuario.name;

    await conectarSocket();
}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token') // le mandamos la info del usuario con ese token
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline')
    });

    socket.on('recibir-mesajes', dibujarMensajes );

    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mesaje-privado', (payload) => console.log('Privado:', payload) );
}

const dibujarUsuarios = ( usuarios = []) => {

    let usersHtml = '';
    usuarios.forEach( ({ name, id }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ name } </h5>
                    <span class="fs-6 text-muted">${ id }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;

}

const dibujarMensajes = ( mensajes = []) => {

    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {

        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;

}

txtMensaje.addEventListener('keyup', ({keyCode}) => {

    const mensaje = txtMensaje.value;
    const id = txtUid.value;

    if (keyCode !== 13) { return } // el keycode = 13 es el enter

    if (mensaje.length === 0) { return } // si el mensaje es vacio que no mande nada

    socket.emit('enviar-mensaje', {mensaje, id});

    txtMensaje.value = '';
})

btnSalir.addEventListener('click', ()=> {

    localStorage.removeItem('token');

    window.location = 'index.html';
    
});


const main = async() => {

    // validar JWT
    await validarJWT();
}

main();