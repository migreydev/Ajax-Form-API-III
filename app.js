const fecha = document.getElementById('fecha');
const email = document.getElementById('email');
const password = document.getElementById('contrasena');
const provincia = document.getElementById('provincia');
const municipio = document.getElementById('municipio');
const telefono = document.getElementById('telefono');
const descripcion = document.getElementById('descripcion');

const form = document.getElementById('form');
const boton = document.getElementById('submit');

const urlUsuarios = 'http://localhost:3000/usuarios';
const urlRegistros = 'http://localhost:3000/registros';
const urlProvincias = 'https://intranetjacaranda.es/Ejercicios/cargaProvinciasXML.php';
const urlMunicipios = 'https://intranetjacaranda.es/Ejercicios/cargaMunicipiosXML.php';


boton.addEventListener('click', async(e)=>{

    e.preventDefault();

    isValidFecha = false;
    isValidEmail = false;
    isValidNombre = false;
    isValidPassword = false;
    isValidTelefono = false;
    isValidDescripcion = false;

    if(validateFecha(fecha.value)){
        const success = document.getElementById('smallFecha');
        success.className = '';
        success.innerText = '';
        isValidFecha = true;
    
    }else{
        const error = document.getElementById('smallFecha');
        error.className = 'text-danger';
        error.innerText = 'Error la fecha debe ser actual, no podra ser ni anterior, ni posterior';
    
    }
    
    if(validateEmail(email.value)){
        const success = document.getElementById('smallEmail');
        success.className = '';
        success.innerText = '';
        isValidEmail = true;
    
    }else{
        const error = document.getElementById('smallEmail');
        error.className = 'text-danger';
        error.innerText = 'Error el email no es valido';
    
    }
    
    if(validateNombre(nombre.value)){
        const success = document.getElementById('smallNombre');
        success.className = '';
        success.innerText = '';
        isValidNombre = true;
    
    }else{
        const error = document.getElementById('smallNombre');
        error.className = 'text-danger';
        error.innerText = 'Error, el nombre no puede estar vacio';
    
    }
    
    if(validatePassword(password.value)){
        const success = document.getElementById('smallContrasena');
        success.className = '';
        success.innerText = '';
        isValidPassword = true;
    
    }else{
        const error = document.getElementById('smallContrasena');
        error.className = 'text-danger';
        error.innerText = 'Error la contraseña debe de contener al menos una letra mayúscula,  minúscula, un digito y un caracter espeacil y al menos 8 caracteres';
    
    }

    if(validateTelefono(telefono.value)){
        const success = document.getElementById('smallTelefono');
        success.className = '';
        success.innerText = '';
        isValidTelefono = true;
    
    }else{
        const error = document.getElementById('smallTelefono');
        error.className = 'text-danger';
        error.innerText = 'Error telefono no es valido';
    
    }
    
    
    if(validateDescription(descripcion.value)){
        const success = document.getElementById('smallDescripcion');
        success.className = '';
        success.innerText = '';
        isValidDescripcion = true;
    
    }else{
        const error = document.getElementById('smallDescripcion');
        error.className = 'text-danger';
        error.innerText = 'Error el campo descripcion debe de tener al menos 30 caracteres';
    
    }
    
    if(isValidFecha && isValidEmail && isValidNombre && isValidPassword && isValidTelefono && isValidDescripcion){
        const respuesta = await fetch (urlRegistros, {
            method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "fecha": fecha.value,
                        "email": email.value,
                        "nombre": nombre.value,
                        "provincia_id": provincia.value,
                        "municipio_id": municipio.value,
                        "telefono": telefono.value,
                        "descripcion": descripcion.value,
                        "password": password.value
                    })
                
        })

        if(!respuesta.ok){
            console.error('Error al añadir un registro');
        }else {
            window.location.href = 'list.html';
        }
    
    }
    
})



function validateFecha (fecha){

    const fechaActual = new Date().getDate()
    const fechaSeleccionada = new Date(fecha).getDate();
    isValid = false;

    if( fechaSeleccionada === fechaActual){

        isValid = true;
    }

    return isValid;
}

function validateEmail(email){

    isValid = false;
    const expReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(expReg.test(email)){
        isValid = true;
    }

    return isValid;
}

function validateNombre(nombre) {
    let isValid = false;

    if (nombre.trim() !== '') {
        isValid = true;
    }

    return isValid;
}


function validatePassword(password){

    isValid = false;
    const expReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    
    if(expReg.test(password)){
        isValid = true;
    }

    return isValid;

}

async function getProvincias(){

    try{

        const respuesta = await fetch (urlProvincias);
    
        if(!respuesta.ok){
            console.error('Error al obtener una respuesta');
        }
    
        const xml = await respuesta.text();
        const responseXml = new DOMParser().parseFromString(xml, 'text/xml');
    
        const provincias = responseXml.querySelectorAll('provincia');
    
        provincias.forEach(provinciaElementos =>{
            
            const codigo = provinciaElementos.querySelector('codigo').textContent;
            const nombre = provinciaElementos.querySelector('nombre').textContent;

            const option = document.createElement('option');
            option.value = codigo;
            option.textContent = nombre;
    
            provincia.append(option);
        })

    }catch(error){
        console.error('Error al obtener las provincias', error);
    }

}

getProvincias();

provincia.addEventListener('change', async()=>{
    
    try{

        const idProvincia = provincia.value;

        const respuesta = await fetch(urlMunicipios,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `provincia=${idProvincia}`
        });

        if(!respuesta.ok){
            console.error('Error al obtener la respuesta');
        }

        const xml = await respuesta.text();
        const responseXml = new DOMParser().parseFromString(xml, 'text/xml');

        const municipios = responseXml.querySelectorAll('municipio');

        municipios.forEach(municipioElemento =>{

            const id = municipioElemento.querySelector('codigo').textContent;
            const nombre = municipioElemento.querySelector('nombre').textContent;

            const option = document.createElement('option');
            option.value = id;
            option.textContent = nombre;

            municipio.append(option);

        })

    }catch (error){
        console.error('Error al obtener los municipios', error);
    }
})

function validateTelefono(telefono){

    isValid = false;
    const expReg = /^\d{9}$/;

    if(expReg.test(telefono)){
        isValid = true;
    }

    return isValid;
}

function validateDescription(descripcion) {
    isValid = false; 

    const caracteres = 30;

    if (descripcion.length >= caracteres) {
        isValid = true;
    }

    return isValid;
}


