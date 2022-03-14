
/**Texto de los botones*/
const addToList = 'Agregar a la lista';
const cancel = 'Cancelar';

// Constantes GLOBALES formulario
const miArticulo = document.getElementById('articulo'),
    miDescripcion = document.getElementById('descripcion'),
    miPrecio = document.getElementById('precio')

const form = document.getElementById('form'),
    miBoton = document.getElementById('boton');


// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC7IxVax8cZ5eLwEhlHE5leNVlX7TBUIQ0",
    authDomain: "firestorecrud-f8226.firebaseapp.com",
    projectId: "firestorecrud-f8226",
});

var db = firebase.firestore();

//Controla la accion del boton enviar
// controlar Funcion Submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    guardarOrCancelar();
});

form.addEventListener('change', (event) => {
    console.log("Hubo cambios");

    if (checkInputs() === true) {
        console.log("campos Vacios");
        setSubmitDisable(miBoton);
    } else {
        console.log("Sin campos vacios");
        setSubmitEnable(miBoton);
    }
})


// ACTIVA / DESACTIVA Boton enviar
setSubmitDisable(miBoton);

function setSubmitDisable(boton) {
    boton.disabled = true;
    const botonControl = boton.parentElement;  // .form-control
    //Agrega la clase del boton Inactivo
    botonControl.className = 'inactivo enviar';
}
function setSubmitEnable(boton) {
    boton.disabled = false;
    const botonControl = boton.parentElement;  // .form-control
    //Agrega la clase del boton Inactivo
    botonControl.className = ' enviar';
}



// Devuelve TRUE si hay un error y FALSE si no lo hay.
function checkInputs() {
    // Obtiene el contenido de los inputs
    const articuloValue = miArticulo.value.trim(),
        descripcionValue = miDescripcion.value.trim(),
        precioValue = miPrecio.value.trim();
     
    let haveAnError = false;

    if (articuloValue === '') {
        haveAnError = true;
    }
    if (descripcionValue === '') {
        haveAnError = true;
    }
    if (precioValue === '') {
        haveAnError = true;
    }
   
    ///Al cargar la imagen llenar el campo imagenValue con la URL Cloudinary;
    // Poner un listener a campo Imagen para que cuando cargue devuelva True y se habilite el boton enviar
    return haveAnError;
}

// GUARDA o CANCELA segun el Texto que Tenga.
function guardarOrCancelar() {  /// Esta podria ir dentro de la funcion Guardar
    let texto = document.getElementById('boton').innerHTML;

    switch (texto) {
        case cancel:
            //Limpia el Formulario
            resetFormulario();
            // Suprime el boton de Guardar cambios               
            document.getElementById('guardar-edicion').style.display = 'none';
            break;
        case addToList:
            //Valida los campos y escribe en Firebase mediante guardar()
            if (checkInputs() === false) {
                console.log('No hubo errores, envia los datos');
                guardar();
                //  resetFormulario();
            } else {
                console.log('Hubo errores, no envies los datos');
            }
            break;
        default:
            //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
            console.log('Ningun texto coincide');
            document.getElementById('boton').innerHTML = addToList;
            break;
    }
}

/**Estilos del Campo de Texto*/
function setInicialFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase por defecto o inicial
    formControl.className = 'form-control inicial';
}
function setErrorFor(input, message) {
    const formControl = input.parentElement;  // .form-control
    const small = formControl.querySelector('small');
    small.innerText = message;
    // Modifica la clase del elemento 
    formControl.className = 'form-control error';
}
function setSuccessFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase error
    formControl.className = 'form-control success';
}

// Activa estilo EXITO / ERROR para campo vacio
function aplicaEstiloAlInput(input) {
    let nombreMayus = input.id.toString().toUpperCase();
    if (input.value.trim() === '') {
        setErrorFor(input, nombreMayus + ' no puede quedar vacio');
    } else {
        setSuccessFor(input);
    }
}

/**Accion GANA / PIERDE Focus un Campo*/
miArticulo.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
miDescripcion.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
miPrecio.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
miArticulo.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});
miDescripcion.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});
miPrecio.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});



// Agregar documentos
function guardar() {
    //Almacena contenido de los campos
    var articulo = document.getElementById('articulo').value,
        descripcion = document.getElementById('descripcion').value,
        precio = document.getElementById('precio').value;
       
    //Calcula fecha y hora Actual para registrar hora de creacion
    let timeStamp = new Date(Date.now());

    db.collection("articulos").add({
        articulo: articulo,
        descripcion: descripcion,
        precio: precio,
        fechaHoraCreacion: timeStamp,
        fechaHoraModificacion: timeStamp,

    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            //Restaura el formulario
            resetFormulario();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

/**Donde Mostrar los Datos?? */
// En Una Tabla 
var table = document.getElementById('table');

// LEE Documentos de Firebase
//  Visualizacion en Tiempo Real
/** Traer datos Una sola vez => Get()
 *  Leer Cambios y mostrarlos => onSnapshot
 * Remplaza get()  por onSnapshot()
 * Se Elimina .get().then((querySnapshot)...) y queda .onSnapshot((querySnapshot)...) 
 */

let comprasRef = db.collection("articulos");
comprasRef.orderBy("fechaHoraModificacion", "desc").onSnapshot((querySnapshot) => {
    table.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().fechaHora}`);
        table.innerHTML += `
        <tr>
        <td>${doc.data().articulo}</td>
        <td>${doc.data().descripcion}</td>
        <td>${doc.data().precio}</td>
        </tr>
        <tr>
        <td></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().articulo}','${doc.data().descripcion}','${doc.data().precio}','${doc.data().imagen}')">Editar</button></td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        </tr>
        <tr></tr>        
        <tr></tr>                
        `

    });
});

// BORRAR documentos
function eliminar(id) {
    db.collection("articulos").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// EDITAR documento
function editar(id, articulo, cantidad, nota, imagen) {
    /**Activa el Boton de GUARDAR / CANCELAR*/
    setSubmitEnable(miBoton);
    
    // Escribe en los campos los valores del renglon seleccionado
    document.getElementById('articulo').value = articulo;
    document.getElementById('descripcion').value = cantidad;
    document.getElementById('precio').value = nota;
  
    //Edita el texto del boton
    document.getElementById('boton').innerHTML = cancel;

     /**Muetra el boton para guardar edicion*/
    var btnGuardarEdicion = document.getElementById('guardar-edicion');
    btnGuardarEdicion.style.display = 'unset';
    //**Lleva la vista al formulario */
    // Uso constante form
    moverseA(form.id);

    // Crea una funcion anonima para ejecutar cuando se haga click
    btnGuardarEdicion.onclick = function () {
        // El ID no va a cambiar
        let compraRef = db.collection("articulos").doc(id);
        // Capturar los cambios realizados en los campos
        let articuloEditado = document.getElementById('articulo').value,
            descripcionEditada = document.getElementById('descripcion').value,
            precioEditado = document.getElementById('precio').value;
        // Calcula la fecha y hora actual del cambio 
        let timeStamp = new Date(Date.now());

        // Actualiza los cambios
        return compraRef.update({
            articulo: articuloEditado,
            descripcion: descripcionEditada,
            precio: precioEditado,
            fechaHoraModificacion: timeStamp,
        })
            .then(() => {
                console.log("Document successfully updated!");
                //Limpia el formulario
                resetFormulario();
                //Oculta Boton Edicion
                btnGuardarEdicion.style.display = 'none';
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}

function moverseA(idElemento) {
    location.hash = "#" + idElemento;
    console.log(idElemento);
}

function resetFormulario() {
    // Si exito Regresa al boton su texto original
    document.getElementById('boton').innerHTML = addToList;
    // Limpia los campos
    document.getElementById('articulo').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('precio').value = '';

     /**Deshabilita el Boton */
    setSubmitDisable(miBoton);
}


form.addEventListener('submit', () => {
    console.log('El formulario ha sido enviado');
    resetValidaciones();
});

function resetValidaciones() {
    /**Uso constantes iniciales
     * const miArticulo = document.getElementById('articulo')*/
    setInicialFor(miArticulo, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miDescripcion, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miPrecio, 'Nombre del articulo no puede quedar vacio');
}

