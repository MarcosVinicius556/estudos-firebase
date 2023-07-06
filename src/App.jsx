import { db } from './FirebaseConnection';
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore';
import './app.css';

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

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

  return (
      <div>
        <h1>Teste firebase</h1>

        <div className="container">
          <label>Titulo</label>
          <textarea 
            type="text"
            placeholder='Digite um titulo'
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)}/>

          <label>Autor: </label>
          <input 
            placeholder='Autor do post'
            value={autor} 
            onChange={(e) => setAutor(e.target.value)}/>

          <button onClick={add}>Cadastrar</button>
          <button onClick={buscar}>Buscar</button>
        </div>
      </div>
  )
}

export default App
