import { db } from './FirebaseConnection';
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import './app.css';

function App() {

  const [ titulo, setTitulo ] = useState('');
  const [ autor, setAutor ] = useState('');
  const [ posts, setPosts ] = useState([]);
  const [ idPost, setIdPost ] = useState('');

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

      await deleteDoc(docRef).then(() => {
                              alert('Post deletado com sucesso!')                      
                            })
                             .catch((error) => console.log(error))
    }

  return (
      <div>
        <h1>Teste firebase</h1>

        <div className="container">

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
