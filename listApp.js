const ul = document.querySelector('ul');
const urlRegistros = 'http://localhost:3000/registros';
const urlProvincia = 'https://intranetjacaranda.es/Ejercicios/cargaProvinciasXML.php';
const urlMunicipios = 'https://intranetjacaranda.es/Ejercicios/cargaMunicipiosXML.php';

async function getRegistros() {
    try {
        const respuesta = await fetch(urlRegistros);

        if (!respuesta.ok) {

            console.error('Error al obtener la respuesta');
        }
        return await respuesta.json();

    } catch (error) {

        console.error('Error al obtener los registros', error);
    }
}

async function cargarRegistros() {

    const registros = await getRegistros();

    for (const registro of registros) {

        const li = document.createElement('li');
        const editar = document.createElement('a');

        editar.innerText = 'Editar';
        editar.className = 'btn btn-warning';

        const provincia = await getProvincia(registro.provincia_id);
        const municipio = await getMunicipio(registro.provincia_id, registros);

        li.innerText = `Id: ${registro.id}, Nombre: ${registro.nombre}, Provincia: ${provincia}, Municipio: ${municipio}`;


        editar.addEventListener('click', async()=>{
            editar.href = `./index.html?id=${registro.id}`;
        })

        li.append(editar);
        ul.append(li);
    }
}

cargarRegistros();

async function getProvincia(idProvincia) {

    try {
        const respuesta = await fetch(urlProvincia);

        if (!respuesta.ok) {
            console.error('Error al obtener una respuesta');
        }
        const xml = await respuesta.text();
        const responseXml = new DOMParser().parseFromString(xml, 'text/xml');

        const provincias = responseXml.querySelectorAll('provincia');

        for (const provincia of provincias) {

            const codigo = provincia.querySelector('codigo').textContent;
            const nombre = provincia.querySelector('nombre').textContent;

            if (codigo === idProvincia) {

                return nombre;
            }
        }
    } catch (error) {
        console.error('Error', error)
    }
}

async function getMunicipio(idProvincia, registros) {
    try {
        const respuesta = await fetch(urlMunicipios, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `provincia=${idProvincia}`
        });

        if (!respuesta.ok) {

            console.error('Error al obtener la respuesta');
        }

        const xml = await respuesta.text();
        const responseXml = new DOMParser().parseFromString(xml, 'text/xml');

        const municipios = responseXml.querySelectorAll('municipio');

        for (const municipio of municipios) {
            const codigoMunicipio = municipio.querySelector('codigo').textContent;

            for (const registro of registros) {

                if (registro.municipio_id === codigoMunicipio) {
                    const nombre = municipio.querySelector('nombre').textContent;

                    return nombre;
                }
            }
        }
    } catch (error) {

        console.error('Error al obtener los municipios', error);
    }
}



