import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

/**
 * Configurações para conexão com o banco do firebase
 */
const firebaseConfig = {
    apiKey: "AIzaSyBdy_0AMuCGsc9ZnxKavOUyMVNoGMF2TS4",
    authDomain: "course-3d40d.firebaseapp.com",
    projectId: "course-3d40d",
    storageBucket: "course-3d40d.appspot.com",
    messagingSenderId: "77928698297",
    appId: "1:77928698297:web:1d43da84d2be80a6516668",
    measurementId: "G-X8LFJG6LB7"
};

//Inicializa as configurações
const firebaseApp = initializeApp(firebaseConfig);

//Inicializa o banco
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, //Exportando para poder utilizar em outros componentes
        auth //Exportando a configuração para autenticação do usuário
        }; 