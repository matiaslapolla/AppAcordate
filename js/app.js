//importa firestore (la db)
const db = firebase.firestore();

//importa el auth
const auth = firebase.auth();

//estado de la app (esto es para editar)
let editstatus = false;

//id de la nota
let id;

//id coleccion
let colnombre;

//usuario (el id despues traido de las credenciales se guarda aca)
let authUser;

//nombre para la coleccion de notas de cada usuario -> usar substring
//parte NOTAS (elementos del DOM, notas y sus funciones)

//editar nota
const editarNota = (id, notaEditada) => db.collection(colnombre).doc(id).update(notaEditada)

//con esto trae la coleccion al dom desde firebase y las muestra
const cargarNotas = () => db.collection(colnombre).get();

//esto trae 1 sola nota (la seleccionada con el id que recibe)  
const cargarNota = (id) => db.collection(colnombre).doc(id).get();

//esto es una funcioncita zarpada de firebase que es una especie de listener para los cambios
const postGuardar = (callback) => db.collection(colnombre).onSnapshot(callback);

//guarda la nota en firebase
const guardarFirebase = (titulo, cuerpo) => db.collection(colnombre).doc().set({titulo,cuerpo});

//eliminar de firebase
const eliminarEnFirebase = notaId => db.collection(colnombre).doc(notaId).delete();

//(e) es el evento-funcion que, cuando carga el dom, trae las notas
window.addEventListener('DOMContentLoaded', async (e) => {

  //seleccionamos los contenedores
  let contenedorBody = document.querySelector('.load');
  colnombre = 'notas-' + authUser.substring(0,5);
  postGuardar((querySnapshot) => {
    console.log('dentro de postguardar');
    contenedorBody.innerHTML = '';
    querySnapshot.forEach(doc => {
      let nota = doc.data();
      nota.id = doc.id;
      contenedorBody.innerHTML += `
      <div class="card">
        <form class="nota-form">
            <textarea class="c titulo" name="titulo" placeholder="Titulo (opcional)" maxlength="24" contenteditable>${doc.data().titulo}</textarea>
            <textarea class="c cuerpo" name="cuerpo" placeholder="Cuerpo" maxlength="240" contenteditable>${doc.data().cuerpo}</textarea>
        </form>
        <button class="boton btnEditar" data-id="${nota.id}">Editar</button>
        <button class="boton btnEliminar" data-id="${nota.id}">Eliminar</button>
      </div>`
    })

    //agarra los botones delete
    //esta adentro del foreach y adentro del postguardar 
    //porque el card modelo no tiene boton eliminar,
    //entonces todos los que hay son de la db y los tiene que agarrar de ahi
    
    let btnsDelete = document.querySelectorAll('.btnEliminar');
    btnsDelete.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await eliminarEnFirebase(e.target.dataset.id);
      })
    })

    //botones editar, lo mismo que los eliminar, todos de la db
    let btnsEditar = document.querySelectorAll('.btnEditar');
    btnsEditar.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const nota = await cargarNota(e.target.dataset.id);
        const contenidoNota = nota.data();
        
        editstatus = true;
        id = nota.id;

        formNota['titulo'].value = contenidoNota.titulo;
        formNota['cuerpo'].value = contenidoNota.cuerpo;
        document.querySelector('#guardar').innerText = 'Editar';
        
      })
    })
  });
});

//selecciona el form de la nota y guarda la nota en la db
let formNota = document.querySelector('.nota-form');
let btnGuardar = document.querySelectorAll('.btnGuardar');

for (let i = 0; i < btnGuardar.length; i++) {
  btnGuardar[i].addEventListener('click', async (e) => {
    e.preventDefault();
    console.log(colnombre);
    let titulo = formNota['titulo'];
    let cuerpo = formNota['cuerpo'];

    if (!editstatus){
      await guardarFirebase(titulo.value,cuerpo.value);
    } else {
      await editarNota(id,{
        titulo: titulo.value,
        cuerpo: cuerpo.value
      });

      //reseteamos el status
      editstatus = false;
      document.querySelector('#guardar').innerText = 'Guardar';
      id = '';

    }

    await cargarNotas();

    formNota.reset();
    titulo.focus();
  });
}

//parte AUTH (elementos del DOM, notas y sus funciones)
//testeamos cada field y botones

const logform = document.querySelector('#loginForm');
const logpassw = document.querySelector('#logpassw');
const logmail = document.querySelector("#logmail");
const btnLogin = document.querySelector('#lgbtn');

const regform = document.querySelector('#regForm');
const regmail = document.querySelector("#regmail");
const regpass = document.querySelector('#regpassw');
const btnReg = document.querySelector('#regbtn');

const signout = document.querySelector('#lgoutbtn');

//registrar usuario
btnReg.addEventListener('click', e => {
    e.preventDefault();
    console.log('creando usuario');
    console.log(regmail.value);
    console.log(regpassw.value);
    auth.
        createUserWithEmailAndPassword(regmail.value,regpass.value)
            .then(userCredential => {
                regform.reset();
                console.log('usuario registrado');
                authUser = userCredential.user.uid;

                //nombre para la coleccion de notas de cada usuario -> usar substring
                colnombre = 'notas-' + authUser.substring(0,5);

                auth.signOut()

                signout.style.display = 'none';
                regform.classList.toggle("hide");
                regExitosoDiv.classList.remove('hide');
                welcomeDiv.classList.add('hide');

            })
});

//login usuario
btnLogin.addEventListener('click', e => {
    e.preventDefault();
    console.log('ingresando');
    console.log(logmail.value);
    console.log(logpassw.value);
    auth.
    signInWithEmailAndPassword(logmail.value,logpassw.value)
    .then(userCredential => {
        logform.reset();
        console.log('iniciaste sesion');
        console.log(userCredential.user.uid);
        authUser = userCredential.user.uid;
        colnombre = 'notas-' + authUser.substring(0,6);
        signout.style.display = 'none';
        logform.classList.toggle('hide');
        postLoginDiv.classList.toggle('hide')
        console.log(colnombre);
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
          bubbles: true,
          cancelable: true
        }));
        signout.style.display = 'block';
        wheader.appendChild(signout)
        
    })
});

//logout
signout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('cerraste sesion');
        signout.style.display = 'none';
        welcomeDiv.classList.remove('hide');
        postLoginDiv.classList.toggle('hide');
    })
});

//parte INICIAR APP

//nombre para la coleccion de notas de cada usuario -> usar substring
// colnombre = 'notas-' + authUser.substring(0,6);

const wheader = document.querySelector('header');

const notUserBtn = document.querySelector('#notUser');
const isUserBtns = document.querySelectorAll('#isUser');

const welcomeDiv = document.querySelector('#welcome');
const iRegFormDiv = document.querySelector('#initRegisterForm');
const iLogFormDiv = document.querySelector('#initLoginForm');
const regExitosoDiv = document.querySelector('#registroExitoso');
const descDiv = document.querySelector('.intro');
const postLoginDiv = document.querySelector('#postlogin');

//si no es usuario arranca el camino de registrarse
notUserBtn.addEventListener('click', e => {
  e.preventDefault();
  welcomeDiv.classList.add('hide');
  iRegFormDiv.classList.toggle("hide")
});

isUserBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    signout.classList.add('hide');
    descDiv.classList.add('hide');
    regExitosoDiv.style.display = 'none';
    welcomeDiv.classList.add('hide');
    iLogFormDiv.classList.toggle('hide');
  })
});

//check estado de usuario
auth.onAuthStateChanged(user => {
  if (user) {
      console.log('auth: logueado');
      signout.style.display = 'block';
      wheader.appendChild(signout)

  } else {
      console.log('auth: no hay sesion iniciada');
      signout.style.display = 'none';
  }
});


