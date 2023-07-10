import { auth, db } from './FirebaseConnection';
import { useState, useEffect } from 'react';
import { doc,
         setDoc,
        collection, 
        addDoc, 
        getDoc, 
        getDocs, 
        updateDoc, 
        deleteDoc,
        onSnapshot } from 'firebase/firestore';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import './app.css';

function App() {

  const [ email, setEmail ] = useState('');
  const [ senha, setSenha ] = useState('');
  const [ user, setUser ] = useState(false);
  const [ userDetail, setUserDetail ] = useState({});

  const [ titulo, setTitulo ] = useState('');
  const [ autor, setAutor ] = useState('');
  const [ posts, setPosts ] = useState([]);
  const [ idPost, setIdPost ] = useState('');

  useEffect(() => { //Buscar todo assim que iniciar, ou quando houver mudança no banco
    async function loadPosts(){
      //Verificação em tempo real (snapshot)
      onSnapshot(collection(db, 'posts'), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((doc) => {
          //Percorrendo a lista retornada do banco e montando o objeto para a lista
          listaPost.push({ 
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
          setPosts(listaPost);
        })
      });
    }

    loadPosts();
  });

  //Função assíncrona, pois pode demorar para retornar resposta do banco 
  async function add() { 
    //Cria um novo documento
    // await setDoc( //Retorna uma promisse, pois pode ou não conseguir salvar no banco
    //         doc(db,      //Passando conexão com o banco (db)
    //            'posts',  //Qual a referência para ele salvar
    //            '12345'), //"id" do documento passado de forma estática
    //            { 
    //               /**
    //                * Dados do documento para inserir no banco <K,V>
    //                */
    //               titulo: titulo,
    //               autor: autor
    //             }
    //         ).then(() => {
    //           console.log(`Salvou novo documento`);
    //         })
    //          .catch((error) => {
    //           console.log(`erro --> ${error}`)
    //          }); 

    await addDoc( //Doferente do setDoc(), este cria um ID automaticamente
          collection(db, //Conexão com o banco
                    'posts'), //Específicando qual será a coleção utilizada
                    {
                      titulo: titulo,
                      autor: autor
                    }
          ).then(() => {
            console.log('Novo documento cadastrado com sucesso!');
            setAutor('');
            setTitulo('');
          })
           .catch((error) => {
            console.log(`Não foi possível cadastrar o documento, motivo: ${error}`);
           });
    }

    async function buscar() {
        const postRef = doc(db, 'posts', '12345'); //Criando a referência do documento

        await getDoc(postRef) //Buscando o documento
                  .then((snapshot) => {
                    setAutor(snapshot.data().autor)
                    setTitulo(snapshot.data().titulo)
                  }) //Sucesso
                  .catch((error) => {
                    console.log('Erro ao buscar post: ' + error)
                  }); //Falha
    }

    /**
     * Busca todos os posts
     */
    async function buscarPosts(){
      const postsRef = collection(db, "posts"); //Acessando a coleção de posts (criando referência)
      await getDocs(postsRef)
                  .then((snapshot) => { //Caso de sucesso
                    let lista = [];
                    snapshot.forEach((doc) => {
                      //Percorrendo a lista retornada do banco e montando o objeto para a lista
                      lista.push({ 
                        id: doc.id,
                        titulo: doc.data().titulo,
                        autor: doc.data().autor
                      });
                      setPosts(lista);
                    })
                  }).catch((error) => { //Caso de falha
                    console.log(error)
                  });
    }

    /**
     * Atualizar Post
     */

    async function atualizarPost(){
      const docRef = doc(db, 'posts', idPost); //Criando a referência do posto
      await updateDoc(docRef, {
        titulo: titulo,
        autor: autor
      }).then(() => {
        alert('Alterou o post!')
        setIdPost('');
        setTitulo('');
        setAutor('');
        setPosts([]);
      })
        .catch(error => {
        console.log(error)
      });
    }

    async function excluirPost(id){
      const docRef = doc(db, 'posts', id);

      await deleteDoc(docRef).then((promisse) => {
                              alert('Post deletado com sucesso!')  
                              setEmail('');
                              setSenha('');                    
                            })
                             .catch((error) => console.log(error))
    }

  async function cadastrar(){
    //Criando um usuário para autenticação no banco de dados
     await createUserWithEmailAndPassword(auth, email, senha)
            .then(() => alert('cadastrado com sucesso!')).catch(error => console.log(error)); 
  }

  async function login(){
    //Mandando dados do usuário para verificar se está autenticado no banco
    await signInWithEmailAndPassword(auth, email, senha) 
          .then(promisse => {
            alert('usuário logado com sucesso!');

            //Guardando dados do usuário
            setUserDetail({
              uid: promisse.user.uid,
              email: promisse.user.email
            });
            setUser(true);

            setEmail('');
            setSenha('');  
          })
          .catch(error => {
            console.log(error);
          });
  }

  async function logout() {
    await signOut(auth); //Faz logout do sistema
    setUser(false);
    setUserDetail({});
  }

  return (
      <div>
        <h1>Teste firebase</h1>

        { user &&
          <div>
            <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br />
            <span>ID: { userDetail.uid } - Email: { userDetail.email } </span>
          </div> 
        }

        <div className="container">
        <h2>Usuários</h2>
          <label>Email</label>
          <textarea 
            type="text"
            placeholder='Digite o seu email'
            value={email} 
            onChange={(e) => setEmail(e.target.value)}/>
          <br />
          
          <label>Senha</label>
          <textarea 
            type="text"
            placeholder='Digite a sua senha'
            value={senha} 
            onChange={(e) => setSenha(e.target.value)}/>
          <br />

          <button onClick={() => cadastrar()}>Cadastrar</button>
          <button onClick={() => login()}>Login</button>
          <button onClick={() => logout()}>Logout</button>
        </div>

        <br /> <hr />
        <div className="container">
        <h2>Posts</h2>
        <label>Id do post</label>
          <textarea 
            type="text"
            placeholder='Digite o id do post'
            value={idPost} 
            onChange={(e) => setIdPost(e.target.value)}/>
          <br />
          <label>Titulo</label>
          <textarea 
            type="text"
            placeholder='Digite um titulo'
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)}/>
          <br />
          <label>Autor: </label>
          <input 
            placeholder='Autor do post'
            value={autor} 
            onChange={(e) => setAutor(e.target.value)}/>
          <br />
          <button onClick={add}>Cadastrar</button>
          <br />
          <button onClick={atualizarPost}>AtualizarPost</button>
          <br />
          <button onClick={buscar}>Buscar</button>
          <br />
          <button onClick={buscarPosts}>Buscar Todos</button>
          <br />
          <ul>
            {posts.map(post => (
                <li key={post.id}>
                  <strong>ID: {post.id}</strong> <br /> 
                  <span>Titulo: {post.titulo}</span> <br /> 
                  <span>Autor: {post.autor}</span> <br /> 
                  <button onClick={() => excluirPost(post.id)}>Excluir</button> <br /> <br /> 
                </li>
              )
            )}
          </ul>
        </div>
      </div>
  )
}

export default App
