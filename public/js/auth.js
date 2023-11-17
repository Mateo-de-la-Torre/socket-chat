// Referencias HTML
const miFormulario = document.querySelector('form');


const url = 'http://localhost:3001/api/auth';


miFormulario.addEventListener('submit', (event)=> {
    event.preventDefault(); 
    const formData = {};
    
    for(let elem of miFormulario.elements ) {
        if (elem.name.length > 0) {
            formData[elem.name] = elem.value
        }
    }

    fetch(url + '/login',{
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then( resp => resp.json())
    .then( ({message, usuario}) => {
        if (message) {
            return console.error(message);
        }

        localStorage.setItem('token', usuario.token);
        window.location = 'chat.html'; // reedireciona una vez q ingreso el mail y la contraseña y se genero el token
    })
    .catch(console.warn)
   
})




function handleCredentialResponse(response) {
    // Google token: ID_TOKEN
 //    console.log('ID_TOKEN', response.credential);


 // traemos el token de google al backend
    const body = { id_token: response.credential };

    fetch(url + '/google',{
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
                    
    })

    .then(resp => resp.json())
    .then( resp => {
        console.log(resp);
        localStorage.setItem('email', resp.usuario.email);
        localStorage.setItem('token', resp.token);

        window.location = 'chat.html';
    })
    .catch(console.warn)

}

const button = document.getElementById('google_logut');

button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    })
}